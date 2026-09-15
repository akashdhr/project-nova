from __future__ import annotations

from uuid import UUID

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.core.config import settings
from app.db.session import get_db
from app.models.entities import User

bearer = HTTPBearer(auto_error=False)


class AuthError(Exception):
    pass


def _decode(token: str) -> dict:
    """Verify a Supabase access token.

    Supabase projects may use the legacy HS256 JWT secret or asymmetric signing keys.
    Prefer the project's JWKS when available and fall back to the configured JWT secret
    for projects still using HS256.
    """
    if not token:
        raise AuthError("Missing token")

    issuer = settings.supabase_issuer
    last_error: Exception | None = None

    if issuer:
        try:
            jwks_client = jwt.PyJWKClient(f"{issuer}/.well-known/jwks.json")
            signing_key = jwks_client.get_signing_key_from_jwt(token)
            return jwt.decode(
                token,
                signing_key.key,
                algorithms=["RS256", "ES256"],
                audience="authenticated",
                issuer=issuer,
            )
        except jwt.PyJWTError as exc:
            last_error = exc
        except Exception as exc:
            last_error = exc

    if settings.supabase_jwt_secret:
        try:
            return jwt.decode(
                token,
                settings.supabase_jwt_secret,
                algorithms=["HS256"],
                audience="authenticated",
                issuer=issuer,
            )
        except jwt.PyJWTError as exc:
            last_error = exc

    raise AuthError("Invalid Supabase authentication token") from last_error


def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer),
    db: Session = Depends(get_db),
) -> User:
    if not credentials:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Authentication required")

    try:
        claims = _decode(credentials.credentials)
        auth_user_id = UUID(str(claims.get("sub")))
    except (ValueError, AuthError):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid authentication token")

    user = db.scalar(select(User).where(User.auth_user_id == auth_user_id))

    # Backward compatibility with the Stage 1 foundation, where the Supabase subject
    # was used directly as the application user's primary key.
    if user is None:
        user = db.get(User, auth_user_id)
        if user is not None and user.auth_user_id is None:
            user.auth_user_id = auth_user_id
            db.commit()
            db.refresh(user)

    if user is None:
        email = str(claims.get("email") or "").strip().lower()
        if email:
            user = db.scalar(select(User).where(User.email == email))
            if user is not None:
                user.auth_user_id = auth_user_id
                metadata = claims.get("user_metadata") or {}
                if not user.name and metadata.get("full_name"):
                    user.name = str(metadata["full_name"])[:200]
                db.commit()
                db.refresh(user)

    if user is None:
        email = str(claims.get("email") or "").strip().lower()
        if not email:
            raise HTTPException(status_code=401, detail="Authenticated user has no email")
        metadata = claims.get("user_metadata") or {}
        user = User(
            auth_user_id=auth_user_id,
            email=email,
            name=str(metadata.get("full_name"))[:200] if metadata.get("full_name") else None,
            is_active=True,
        )
        db.add(user)
        try:
            db.commit()
            db.refresh(user)
        except Exception:
            db.rollback()
            # A concurrent first request may have created the same email/auth subject.
            user = db.scalar(select(User).where(User.auth_user_id == auth_user_id)) or db.scalar(
                select(User).where(User.email == email)
            )
            if user is None:
                raise HTTPException(status_code=500, detail="Unable to create application user")

    if not user.is_active:
        raise HTTPException(status_code=403, detail="User account is inactive")
    return user


def require_owner(user_id: UUID, current_user: User) -> None:
    if user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Resource does not belong to authenticated user")
