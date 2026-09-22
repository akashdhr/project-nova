from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.core.auth import get_current_user, require_owner
from app.models.entities import User, Job, Recommendation, RecommendationFeedback
from app.schemas.core import RecommendationOut, FeedbackIn

from app.services.recommendations import build_feed

router = APIRouter(prefix="/api/v1")

@router.get('/recommendations/{user_id}', response_model=list[RecommendationOut])
def recommendations(user_id: UUID, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    require_owner(user_id, current_user)
    recs = build_feed(db, user_id)
    return [RecommendationOut(recommendation_id=r.id, job=db.get(Job, r.job_id), match_label=r.match_label, explanation=r.explanation, rank_position=r.rank_position) for r in recs]

@router.post('/recommendations/{recommendation_id}/feedback')
def feedback(recommendation_id: UUID, x: FeedbackIn, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    r = db.get(Recommendation, recommendation_id)
    if not r or r.user_id != current_user.id:
        raise HTTPException(404, 'Recommendation not found')
    db.add(RecommendationFeedback(recommendation_id=recommendation_id, user_id=current_user.id, feedback_type=x.feedback_type, reason=x.reason, metadata_json=x.metadata))
    db.commit()
    return {'status': 'recorded'}
