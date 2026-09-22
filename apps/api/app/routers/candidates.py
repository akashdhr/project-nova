from uuid import UUID
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, File, UploadFile
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.db.session import get_db
from app.core.auth import get_current_user, require_owner
from app.core.config import settings
from app.models.entities import User, CandidateProfile, CandidateProfileStatus, CareerPreferences, Resume
from app.schemas.core import CandidateProfileOut, CandidateProfileIn, PreferencesOut, PreferencesIn

from app.services.storage import storage
from app.services.resume import extract_text
from app.services.profile_extraction import sanitize_for_ai, validate_extraction, profile_to_candidate_fields
from app.ai import get_ai_service

router = APIRouter(prefix="/api/v1")

@router.get('/candidates/{user_id}', response_model=CandidateProfileOut)
def get_candidate(user_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_owner(user_id, current_user)
    x = db.scalar(select(CandidateProfile).where(CandidateProfile.user_id == user_id))
    if not x:
        raise HTTPException(404, 'Profile not found')
    return x

@router.put('/candidates/{user_id}', response_model=CandidateProfileOut)
def put_candidate(user_id: UUID, x: CandidateProfileIn, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_owner(user_id, current_user)
    p = db.scalar(select(CandidateProfile).where(CandidateProfile.user_id == user_id))
    if not p:
        p = CandidateProfile(user_id=user_id)
        db.add(p)
    for k, v in x.model_dump().items():
        setattr(p, k, v)
    p.status = CandidateProfileStatus.EDITED.value
    p.confirmed_at = None
    db.commit()
    db.refresh(p)
    return p

@router.post('/candidates/{user_id}/confirm', response_model=CandidateProfileOut)
def confirm_candidate(user_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_owner(user_id, current_user)
    p = db.scalar(select(CandidateProfile).where(CandidateProfile.user_id == user_id))
    if not p:
        raise HTTPException(404, 'Profile not found')
    p.status = CandidateProfileStatus.CONFIRMED.value
    p.confirmed_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(p)
    return p

@router.get('/candidates/{user_id}/preferences', response_model=PreferencesOut)
def get_preferences(user_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_owner(user_id, current_user)
    x = db.scalar(select(CareerPreferences).where(CareerPreferences.user_id == user_id))
    if not x:
        raise HTTPException(404, 'Preferences not found')
    return x

@router.put('/candidates/{user_id}/preferences', response_model=PreferencesOut)
def put_preferences(user_id: UUID, x: PreferencesIn, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_owner(user_id, current_user)
    p = db.scalar(select(CareerPreferences).where(CareerPreferences.user_id == user_id))
    if not p:
        p = CareerPreferences(user_id=user_id)
        db.add(p)
    for k, v in x.model_dump().items():
        setattr(p, k, v)
    db.commit()
    db.refresh(p)
    return p

@router.post('/resumes/{user_id}')
async def upload_resume(user_id: UUID, file: UploadFile = File(...), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_owner(user_id, current_user)
    allowed = {'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'}
    if file.content_type not in allowed:
        raise HTTPException(415, 'Unsupported resume format')
    content = await file.read()
    if not content.strip():
        raise HTTPException(400, 'Resume is empty')
    if len(content) > settings.resume_max_bytes:
        raise HTTPException(413, 'Resume exceeds maximum allowed size')
    key = await storage.save(str(user_id), file.filename or 'resume', content, file.content_type)
    from pathlib import Path
    path = Path(settings.resume_storage_path) / key
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(content)
    db.query(Resume).filter(Resume.user_id == user_id).update({'is_current': False})
    provider = 'supabase' if settings.supabase_url and settings.supabase_service_role_key else 'local'
    r = Resume(user_id=user_id, storage_key=key, filename=file.filename or 'resume', content_type=file.content_type, file_size_bytes=len(content), storage_provider=provider, extraction_status='processing')
    db.add(r)
    db.commit()
    db.refresh(r)
    try:
        r.extracted_text = extract_text(path, file.content_type)
        if not r.extracted_text or not r.extracted_text.strip():
            raise ValueError('Resume contains no readable text')
        r.extraction_status = 'extracted'
        db.commit()
        ai = get_ai_service()
        extracted = ai.extract_resume(sanitize_for_ai(r.extracted_text))
        profile = validate_extraction(extracted)
        fields = profile_to_candidate_fields(profile)
        r.ai_extraction = fields
        p = db.scalar(select(CandidateProfile).where(CandidateProfile.user_id == user_id))
        if not p:
            p = CandidateProfile(user_id=user_id)
            db.add(p)
        for k, v in fields.items():
            setattr(p, k, v)
        p.status = CandidateProfileStatus.EXTRACTED.value
        p.confirmed_at = None
        r.extraction_status = 'completed'
        db.commit()
        db.refresh(p)
    except ValueError as exc:
        db.rollback()
        r = db.get(Resume, r.id)
        if r:
            r.extraction_status = 'failed'
            db.commit()
        raise HTTPException(422, str(exc))
    except Exception:
        db.rollback()
        r = db.get(Resume, r.id)
        if r:
            r.extraction_status = 'failed'
            db.commit()
        raise HTTPException(503, 'Resume processing is temporarily unavailable. Please try again.')
    return {'id': str(r.id), 'status': r.extraction_status, 'profile_status': p.status, 'text_length': len(r.extracted_text or ''), 'storage_provider': provider}
