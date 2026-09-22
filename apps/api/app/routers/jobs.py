from uuid import UUID
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.auth import get_current_user
from app.core.config import settings
from app.models.entities import User, Job, UserInteraction, InteractionType
from app.schemas.core import JobOut, InteractionIn

from app.services.ingestion import ingest_records
from app.connectors.mock import MockJobSourceConnector
from app.connectors.base import RawJobRecord

router = APIRouter(prefix="/api/v1")

@router.post('/jobs/ingest/mock')
def ingest_mock(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    now = datetime.now(timezone.utc)
    records = [
        RawJobRecord('mock', 'qa-1', 'QA Automation Engineer II', 'Acme Technologies', 'Build automation using Selenium, Python, API testing and Jenkins.', location=['Bengaluru'], work_mode='hybrid', skills=['Python', 'Selenium', 'API', 'Jenkins'], experience_min=3, experience_max=6, source_url='https://example.com/jobs/qa-1', application_url='https://example.com/apply/qa-1', posted_at=now),
        RawJobRecord('mock', 'sdet-1', 'SDET Lead', 'Fintech Labs', 'Lead quality engineering and automation strategy using Java, Playwright and CI/CD.', location=['Bengaluru', 'Remote'], work_mode='remote', skills=['Java', 'Playwright', 'CI/CD'], experience_min=5, experience_max=9, source_url='https://example.com/jobs/sdet-2', application_url='https://example.com/apply/sdet-2', posted_at=now)
    ]
    created = ingest_records(db, MockJobSourceConnector(records), records, settings.stale_after_days)
    return {'created': len(created)}

@router.get('/jobs/{job_id}', response_model=JobOut)
def get_job(job_id: UUID, db: Session = Depends(get_db)):
    j = db.get(Job, job_id)
    if not j:
        raise HTTPException(404, 'Job not found')
    return j

def interaction(user_id, job_id, itype, metadata, db):
    if not db.get(Job, job_id):
        raise HTTPException(404, 'Job not found')
    db.add(UserInteraction(user_id=user_id, job_id=job_id, interaction_type=itype, metadata_json=metadata))
    db.commit()
    return {'status': 'recorded'}

@router.post('/jobs/{job_id}/save')
def save(job_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return interaction(current_user.id, job_id, InteractionType.SAVED, {}, db)

@router.post('/jobs/{job_id}/apply-click')
def apply_click(job_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return interaction(current_user.id, job_id, InteractionType.APPLY_CLICK, {}, db)

@router.post('/jobs/{job_id}/not-interested')
def not_interested(job_id: UUID, x: InteractionIn = InteractionIn(), db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    meta = x.metadata | ({'reason': x.rejection_reason} if x.rejection_reason else {})
    return interaction(current_user.id, job_id, InteractionType.NOT_INTERESTED, meta, db)
