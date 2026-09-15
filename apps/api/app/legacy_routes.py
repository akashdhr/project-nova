from fastapi import APIRouter, Depends, HTTPException, File, UploadFile, Form
from sqlalchemy.orm import Session
from sqlalchemy import select
from typing import Any, Dict
from pydantic import BaseModel
from .db.session import get_db
from .core.auth import get_current_user
from .models.entities import User, CandidateProfile, CareerPreferences, Resume, JobMatch, Job, UserInteraction, InteractionType
from uuid import UUID
from app.services.storage import storage
from app.core.config import settings
from app.services.resume import extract_text
from app.ai import get_ai_service
from app.services.profile_extraction import sanitize_for_ai, validate_extraction, profile_to_candidate_fields
from app.models.entities import CandidateProfileStatus
import json

router = APIRouter()

class ProfileUpdate(BaseModel):
    firstName: str = None
    lastName: str = None
    currentRole: str = None
    targetRoles: list[str] = None
    industries: list[str] = None
    locations: list[str] = None
    workMode: str = None
    compensation: str = None
    careerPriorities: list[str] = None
    dealBreakers: list[str] = None
    resumeUrl: str = None
    avatarUrl: str = None
    skills: list[str] = None

@router.get('/profile')
def get_profile(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    cp = db.scalar(select(CandidateProfile).where(CandidateProfile.user_id == current_user.id))
    pref = db.scalar(select(CareerPreferences).where(CareerPreferences.user_id == current_user.id))
    resume = db.scalar(select(Resume).where(Resume.user_id == current_user.id).order_by(Resume.created_at.desc()))
    
    first_name = ""
    last_name = ""
    if current_user.name:
        parts = current_user.name.split(" ", 1)
        first_name = parts[0]
        if len(parts) > 1:
            last_name = parts[1]

    return {
        "firstName": first_name,
        "lastName": last_name,
        "currentRole": cp.current_role if cp else None,
        "skills": cp.skills if cp else [],
        "targetRoles": pref.target_roles if pref else [],
        "industries": pref.industries if pref else [],
        "locations": pref.locations if pref else [],
        "workMode": pref.work_modes[0] if pref and pref.work_modes else "any",
        "compensation": str(pref.min_compensation) if pref and pref.min_compensation else None,
        "careerPriorities": pref.job_priorities if pref else [],
        "dealBreakers": pref.deal_breakers if pref else [],
        "resumeUrl": resume.filename if resume else None,
        "professional_summary": cp.professional_summary if cp else None,
        "avatarUrl": current_user.avatar_url
    }

@router.put('/profile')
def update_profile(data: ProfileUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    if data.firstName or data.lastName:
        current_user.name = f"{data.firstName or ''} {data.lastName or ''}".strip()
    if data.avatarUrl is not None:
        current_user.avatar_url = data.avatarUrl
    
    cp = db.scalar(select(CandidateProfile).where(CandidateProfile.user_id == current_user.id))
    if not cp:
        cp = CandidateProfile(user_id=current_user.id)
        db.add(cp)
    
    pref = db.scalar(select(CareerPreferences).where(CareerPreferences.user_id == current_user.id))
    if not pref:
        pref = CareerPreferences(user_id=current_user.id)
        db.add(pref)
    
    if data.currentRole is not None: cp.current_role = data.currentRole
    if data.skills is not None: cp.skills = data.skills
    
    if data.targetRoles is not None: pref.target_roles = data.targetRoles
    if data.industries is not None: pref.industries = data.industries
    if data.locations is not None: pref.locations = data.locations
    if data.workMode is not None: pref.work_modes = [data.workMode]
    if data.compensation is not None:
        if not data.compensation.strip():
            pref.min_compensation = None
        else:
            try:
                import re
                nums = re.findall(r'\d+', data.compensation.replace(',', ''))
                if nums:
                    pref.min_compensation = float(nums[0])
            except:
                pass
    if data.careerPriorities is not None: pref.job_priorities = data.careerPriorities
    if data.dealBreakers is not None: pref.deal_breakers = data.dealBreakers

    db.commit()
    return get_profile(db, current_user)

@router.post('/resume')
async def upload_legacy_resume(
    resume: UploadFile = File(...),
    termsVersion: str = Form(None),
    privacyPolicyVersion: str = Form(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    from app.main import upload_resume
    res = await upload_resume(current_user.id, resume, db, current_user)
    return {"success": True, "profile": get_profile(db, current_user)}

@router.get('/matches')
def get_matches(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    from app.services.recommendations import build_feed
    recs = build_feed(db, current_user.id)
    matches = []
    for r in recs:
        job = db.get(Job, r.job_id)
        matches.append({
            "id": str(r.match_id),
            "jobId": str(job.id),
            "job": {
                "id": str(job.id),
                "title": job.title,
                "company": job.company.display_name if job.company else "Company",
                "location": job.locations[0] if job.locations else "Remote",
                "salary": f"${job.salary_min}" if job.salary_min else None,
                "workMode": job.work_mode,
                "description": job.description
            },
            "score": 0.9,
            "reasons": json.loads(r.explanation) if r.explanation else ["Strong match based on skills"]
        })
    return matches

@router.post('/saved/{job_id}/save')
def save_job(job_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    from app.main import save
    save(job_id, db, current_user)
    return {"success": True}

@router.delete('/saved/{job_id}/save')
def unsave_job(job_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    ui = db.scalar(select(UserInteraction).where(UserInteraction.user_id==current_user.id, UserInteraction.job_id==job_id, UserInteraction.interaction_type==InteractionType.SAVED))
    if ui:
        db.delete(ui)
        db.commit()
    return {"success": True}

@router.get('/saved')
def get_saved(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    uis = db.execute(select(UserInteraction).where(UserInteraction.user_id==current_user.id, UserInteraction.interaction_type==InteractionType.SAVED)).scalars().all()
    results = []
    for ui in uis:
        job = db.get(Job, ui.job_id)
        if job:
            results.append({
                "id": str(ui.id),
                "jobId": str(job.id),
                "job": {
                    "id": str(job.id),
                    "title": job.title,
                    "company": job.company.display_name if job.company else "Company",
                    "location": job.locations[0] if job.locations else "Remote"
                }
            })
    return results

@router.post('/applications')
def apply_job(data: dict, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    from app.main import apply_click
    job_id = data.get("jobId")
    if job_id:
        apply_click(UUID(job_id), db, current_user)
    return {"success": True}

@router.get('/applications')
def get_applications(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    uis = db.execute(select(UserInteraction).where(UserInteraction.user_id==current_user.id, UserInteraction.interaction_type==InteractionType.APPLY_CLICK)).scalars().all()
    results = []
    for ui in uis:
        job = db.get(Job, ui.job_id)
        if job:
            results.append({
                "id": str(ui.id),
                "jobId": str(job.id),
                "job": {
                    "id": str(job.id),
                    "title": job.title,
                    "company": job.company.display_name if job.company else "Company",
                    "location": job.locations[0] if job.locations else "Remote"
                },
                "status": "Applied",
                "appliedAt": ui.created_at.isoformat()
            })
    return results
