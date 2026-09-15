from uuid import UUID
from datetime import datetime, timezone
from fastapi import Depends, FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.core.logging import configure_logging
from app.core.config import settings
from app.core.auth import get_current_user, require_owner
from app.db.session import get_db
from app.models.entities import *
from app.schemas.core import *
from app.services.ingestion import ingest_records
from app.services.recommendations import build_feed
from app.services.resume import extract_text
from app.services.storage import storage
from app.services.profile_extraction import sanitize_for_ai, validate_extraction, profile_to_candidate_fields
from app.ai import get_ai_service
from app.connectors.mock import MockJobSourceConnector
from app.connectors.base import RawJobRecord

configure_logging(); app=FastAPI(title=f"{settings.app_name} Career Agent API",version="0.3.0")
from app.legacy_routes import router as legacy_router
app.include_router(legacy_router)

# The Next.js frontend runs on localhost:3000 during local development and
# calls the API on localhost:8000. Allow only the local development origins.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get('/health')
def health(): return {"status":"ok","env":settings.app_env}

@app.post('/api/v1/users',response_model=UserOut)
def create_user(x:UserCreate,db:Session=Depends(get_db)):
    if settings.app_env == "production": raise HTTPException(404,"Use Supabase Auth for account creation")
    if db.scalar(select(User).where(User.email==x.email)): raise HTTPException(409,'Email already exists')
    u=User(**x.model_dump()); db.add(u); db.commit(); db.refresh(u); return u

@app.get('/api/v1/me',response_model=UserOut)
def me(current_user:User=Depends(get_current_user)): return current_user

@app.get('/api/v1/candidates/{user_id}',response_model=CandidateProfileOut)
def get_candidate(user_id:UUID,db:Session=Depends(get_db),current_user:User=Depends(get_current_user)):
    require_owner(user_id,current_user); x=db.scalar(select(CandidateProfile).where(CandidateProfile.user_id==user_id))
    if not x: raise HTTPException(404,'Profile not found')
    return x

@app.put('/api/v1/candidates/{user_id}',response_model=CandidateProfileOut)
def put_candidate(user_id:UUID,x:CandidateProfileIn,db:Session=Depends(get_db),current_user:User=Depends(get_current_user)):
    require_owner(user_id,current_user); p=db.scalar(select(CandidateProfile).where(CandidateProfile.user_id==user_id))
    if not p: p=CandidateProfile(user_id=user_id); db.add(p)
    for k,v in x.model_dump().items(): setattr(p,k,v)
    p.status=CandidateProfileStatus.EDITED.value
    p.confirmed_at=None
    db.commit(); db.refresh(p); return p

@app.post('/api/v1/candidates/{user_id}/confirm',response_model=CandidateProfileOut)
def confirm_candidate(user_id:UUID,db:Session=Depends(get_db),current_user:User=Depends(get_current_user)):
    require_owner(user_id,current_user); p=db.scalar(select(CandidateProfile).where(CandidateProfile.user_id==user_id))
    if not p: raise HTTPException(404,'Profile not found')
    p.status=CandidateProfileStatus.CONFIRMED.value; p.confirmed_at=datetime.now(timezone.utc)
    db.commit(); db.refresh(p); return p

@app.get('/api/v1/candidates/{user_id}/preferences',response_model=PreferencesOut)
def get_preferences(user_id:UUID,db:Session=Depends(get_db),current_user:User=Depends(get_current_user)):
    require_owner(user_id,current_user); x=db.scalar(select(CareerPreferences).where(CareerPreferences.user_id==user_id))
    if not x: raise HTTPException(404,'Preferences not found')
    return x

@app.put('/api/v1/candidates/{user_id}/preferences',response_model=PreferencesOut)
def put_preferences(user_id:UUID,x:PreferencesIn,db:Session=Depends(get_db),current_user:User=Depends(get_current_user)):
    require_owner(user_id,current_user); p=db.scalar(select(CareerPreferences).where(CareerPreferences.user_id==user_id))
    if not p: p=CareerPreferences(user_id=user_id); db.add(p)
    for k,v in x.model_dump().items(): setattr(p,k,v)
    db.commit(); db.refresh(p); return p

@app.post('/api/v1/resumes/{user_id}')
async def upload_resume(user_id:UUID,file:UploadFile=File(...),db:Session=Depends(get_db),current_user:User=Depends(get_current_user)):
    require_owner(user_id,current_user)
    allowed={'application/pdf','application/vnd.openxmlformats-officedocument.wordprocessingml.document','text/plain'}
    if file.content_type not in allowed: raise HTTPException(415,'Unsupported resume format')
    content=await file.read()
    if not content.strip(): raise HTTPException(400,'Resume is empty')
    if len(content)>settings.resume_max_bytes: raise HTTPException(413,'Resume exceeds maximum allowed size')
    key=await storage.save(str(user_id),file.filename or 'resume',content,file.content_type)
    from pathlib import Path
    path=Path(settings.resume_storage_path)/key
    path.parent.mkdir(parents=True,exist_ok=True); path.write_bytes(content)
    db.query(Resume).filter(Resume.user_id==user_id).update({'is_current':False})
    provider='supabase' if settings.supabase_url and settings.supabase_service_role_key else 'local'
    r=Resume(user_id=user_id,storage_key=key,filename=file.filename or 'resume',content_type=file.content_type,file_size_bytes=len(content),storage_provider=provider,extraction_status='processing')
    db.add(r); db.commit(); db.refresh(r)
    try:
        r.extracted_text=extract_text(path,file.content_type)
        if not r.extracted_text or not r.extracted_text.strip(): raise ValueError('Resume contains no readable text')
        r.extraction_status='extracted'; db.commit()
        ai=get_ai_service()
        extracted=ai.extract_resume(sanitize_for_ai(r.extracted_text))
        profile=validate_extraction(extracted)
        fields=profile_to_candidate_fields(profile)
        r.ai_extraction=fields
        p=db.scalar(select(CandidateProfile).where(CandidateProfile.user_id==user_id))
        if not p:
            p=CandidateProfile(user_id=user_id)
            db.add(p)
        for k,v in fields.items(): setattr(p,k,v)
        p.status=CandidateProfileStatus.EXTRACTED.value
        p.confirmed_at=None
        r.extraction_status='completed'
        db.commit(); db.refresh(p)
    except ValueError as exc:
        db.rollback(); r=db.get(Resume,r.id)
        if r: r.extraction_status='failed'; db.commit()
        raise HTTPException(422,str(exc))
    except Exception:
        db.rollback(); r=db.get(Resume,r.id)
        if r: r.extraction_status='failed'; db.commit()
        raise HTTPException(503,'Resume processing is temporarily unavailable. Please try again.')
    return {'id':str(r.id),'status':r.extraction_status,'profile_status':p.status,'text_length':len(r.extracted_text or ''),'storage_provider':provider}

@app.post('/api/v1/jobs/ingest/mock')
def ingest_mock(db:Session=Depends(get_db),current_user:User=Depends(get_current_user)):
    now=datetime.now(timezone.utc)
    records=[RawJobRecord('mock','qa-1','QA Automation Engineer II','Acme Technologies','Build automation using Selenium, Python, API testing and Jenkins.',location=['Bengaluru'],work_mode='hybrid',skills=['Python','Selenium','API','Jenkins'],experience_min=3,experience_max=6,source_url='https://example.com/jobs/qa-1',application_url='https://example.com/apply/qa-1',posted_at=now),RawJobRecord('mock','sdet-1','SDET Lead','Fintech Labs','Lead quality engineering and automation strategy using Java, Playwright and CI/CD.',location=['Bengaluru','Remote'],work_mode='remote',skills=['Java','Playwright','CI/CD'],experience_min=5,experience_max=9,source_url='https://example.com/jobs/sdet-2',application_url='https://example.com/apply/sdet-2',posted_at=now)]
    created=ingest_records(db,MockJobSourceConnector(records),records,settings.stale_after_days); return {'created':len(created)}

@app.get('/api/v1/jobs/{job_id}',response_model=JobOut)
def get_job(job_id:UUID,db:Session=Depends(get_db)):
    j=db.get(Job,job_id)
    if not j: raise HTTPException(404,'Job not found')
    return j

@app.get('/api/v1/recommendations/{user_id}',response_model=list[RecommendationOut])
def recommendations(user_id:UUID,db:Session=Depends(get_db),current_user:User=Depends(get_current_user)):
    require_owner(user_id,current_user); recs=build_feed(db,user_id)
    return [RecommendationOut(recommendation_id=r.id,job=db.get(Job,r.job_id),match_label=r.match_label,explanation=r.explanation,rank_position=r.rank_position) for r in recs]

def interaction(user_id,job_id,itype,metadata,db):
    if not db.get(Job,job_id): raise HTTPException(404,'Job not found')
    db.add(UserInteraction(user_id=user_id,job_id=job_id,interaction_type=itype,metadata_json=metadata)); db.commit(); return {'status':'recorded'}

@app.post('/api/v1/jobs/{job_id}/save')
def save(job_id:UUID,db:Session=Depends(get_db),current_user:User=Depends(get_current_user)): return interaction(current_user.id,job_id,InteractionType.SAVED,{},db)
@app.post('/api/v1/jobs/{job_id}/apply-click')
def apply_click(job_id:UUID,db:Session=Depends(get_db),current_user:User=Depends(get_current_user)): return interaction(current_user.id,job_id,InteractionType.APPLY_CLICK,{},db)
@app.post('/api/v1/jobs/{job_id}/not-interested')
def not_interested(job_id:UUID,x:InteractionIn=InteractionIn(),db:Session=Depends(get_db),current_user:User=Depends(get_current_user)):
    meta=x.metadata | ({'reason':x.rejection_reason} if x.rejection_reason else {}); return interaction(current_user.id,job_id,InteractionType.NOT_INTERESTED,meta,db)
@app.post('/api/v1/recommendations/{recommendation_id}/feedback')
def feedback(recommendation_id:UUID,x:FeedbackIn,db:Session=Depends(get_db),current_user:User=Depends(get_current_user)):
    r=db.get(Recommendation,recommendation_id)
    if not r or r.user_id!=current_user.id: raise HTTPException(404,'Recommendation not found')
    db.add(RecommendationFeedback(recommendation_id=recommendation_id,user_id=current_user.id,feedback_type=x.feedback_type,reason=x.reason,metadata_json=x.metadata)); db.commit(); return {'status':'recorded'}
