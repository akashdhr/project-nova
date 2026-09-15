from datetime import datetime, timezone
from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.entities import Company, ExternalJobReference, Job, JobSource, JobStatus, SourceStatus
from app.services.dedupe import stable_canonical_id, normalize_url
from app.services.freshness import apply_freshness

def ingest_records(db:Session, connector, records, stale_after_days=14):
    source=db.scalar(select(JobSource).where(JobSource.name==connector.source_name))
    if not source:
        source=JobSource(name=connector.source_name,status=SourceStatus.ACTIVE); db.add(source); db.flush()
    source.last_refresh_at=datetime.now(timezone.utc)
    created=[]
    for raw in records:
        n=connector.normalize(raw)
        ext=db.scalar(select(ExternalJobReference).where(ExternalJobReference.source_id==source.id,ExternalJobReference.source_job_id==n.source_job_id))
        if ext:
            job=db.get(Job,ext.job_id); job.last_seen_at=datetime.now(timezone.utc); apply_freshness(job,stale_after_days); ext.raw_payload=n.payload; ext.last_seen_at=job.last_seen_at; continue
        company=db.scalar(select(Company).where(Company.canonical_name==n.company))
        if not company: company=Company(canonical_name=n.company,display_name=raw.company); db.add(company); db.flush()
        canonical=stable_canonical_id(n)
        job=db.scalar(select(Job).where(Job.canonical_id==canonical))
        if not job:
            job=Job(canonical_id=canonical,company_id=company.id,title=n.title,original_title=n.original_title,description=n.description,skills=n.skills,locations=n.locations,work_mode=n.work_mode,experience_min=n.experience_min,experience_max=n.experience_max,salary_min=n.salary_min,salary_max=n.salary_max,salary_currency=n.salary_currency,employment_type=n.employment_type,posted_at=n.posted_at,source_updated_at=n.updated_at,source_url=n.source_url,application_url=n.application_url,source_data=n.payload,credibility_signals={"source_identity":connector.source_name},status=JobStatus.ACTIVE)
            db.add(job); db.flush(); created.append(job)
        elif n.updated_at and (not job.source_updated_at or n.updated_at>job.source_updated_at):
            job.source_updated_at=n.updated_at; job.title=n.title; job.description=n.description; job.skills=n.skills; job.locations=n.locations
        ext=ExternalJobReference(job_id=job.id,source_id=source.id,source_job_id=n.source_job_id,source_url=n.source_url,raw_payload=n.payload,last_seen_at=datetime.now(timezone.utc)); db.add(ext)
    db.commit(); return created
