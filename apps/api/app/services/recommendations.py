from sqlalchemy import select
from app.models.entities import CandidateProfile, CareerPreferences, Job, JobMatch, Recommendation, RecommendationStatus, JobStatus
from app.matching.engine import match_candidate_to_job

def build_feed(db,user_id,limit=20):
    c=db.scalar(select(CandidateProfile).where(CandidateProfile.user_id==user_id)); p=db.scalar(select(CareerPreferences).where(CareerPreferences.user_id==user_id))
    if not c or not p: return []
    jobs=db.scalars(select(Job).where(Job.status==JobStatus.ACTIVE).order_by(Job.posted_at.desc().nullslast()).limit(200)).all()
    ranked=[]
    for job in jobs:
        r=match_candidate_to_job(c,p,job)
        if r.match_status=="filtered": continue
        match=db.scalar(select(JobMatch).where(JobMatch.user_id==user_id,JobMatch.job_id==job.id))
        if not match: match=JobMatch(user_id=user_id,job_id=job.id,match_status=r.match_status,score=r.score,signals=r.signals,hard_filter_results=r.hard_filter_results,explanation_inputs=r.explanation_inputs); db.add(match); db.flush()
        else: match.match_status=r.match_status; match.score=r.score; match.signals=r.signals; match.hard_filter_results=r.hard_filter_results
        ranked.append((job,match,r))
    ranked.sort(key=lambda x:x[1].score,reverse=True)
    out=[]
    for i,(job,match,r) in enumerate(ranked[:limit],1):
        rec=db.scalar(select(Recommendation).where(Recommendation.user_id==user_id,Recommendation.job_id==job.id,Recommendation.status==RecommendationStatus.ACTIVE))
        explanation=f"Matches {len(r.matched_skills)} relevant skills; target-role alignment is {'strong' if r.signals['career_direction_fit'] else 'limited'}."
        if not rec: rec=Recommendation(user_id=user_id,job_id=job.id,match_id=match.id,rank_position=i,match_label={'strong':'Strong Match','good':'Good Match','potential':'Potential Match'}[r.match_status],explanation=explanation); db.add(rec)
        else: rec.rank_position=i; rec.match_label={'strong':'Strong Match','good':'Good Match','potential':'Potential Match'}[r.match_status]; rec.explanation=explanation
        out.append(rec)
    db.commit(); return out
