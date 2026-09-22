from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.db.session import get_db
from app.core.auth import get_current_user
from app.core.config import settings
from app.models.entities import User
from app.schemas.core import UserOut, UserCreate

router = APIRouter(prefix="/api/v1")

@router.post('/users', response_model=UserOut)
def create_user(x: UserCreate, db: Session = Depends(get_db)):
    if settings.app_env == "production":
        raise HTTPException(404, "Use Supabase Auth for account creation")
    if db.scalar(select(User).where(User.email == x.email)):
        raise HTTPException(409, 'Email already exists')
    u = User(**x.model_dump())
    db.add(u)
    db.commit()
    db.refresh(u)
    return u

@router.get('/me', response_model=UserOut)
def me(current_user: User = Depends(get_current_user)):
    return current_user
