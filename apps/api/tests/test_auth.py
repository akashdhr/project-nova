from types import SimpleNamespace
from uuid import uuid4

import jwt
import pytest
from fastapi import HTTPException

from app.core import auth
from app.core.auth import get_current_user, require_owner
from app.models.entities import User


def test_decode_supabase_hs256_token(monkeypatch):
    secret = "test-secret-" + "x" * 21
    monkeypatch.setattr(auth.settings, "supabase_jwt_secret", secret)
    monkeypatch.setattr(auth.settings, "supabase_url", "https://example.supabase.co")
    token = jwt.encode(
        {"sub": str(uuid4()), "email": "user@example.com", "aud": "authenticated", "iss": "https://example.supabase.co/auth/v1"},
        secret,
        algorithm="HS256",
    )
    claims = auth._decode(token)
    assert claims["email"] == "user@example.com"


def test_invalid_token_rejected(monkeypatch):
    monkeypatch.setattr(auth.settings, "supabase_jwt_secret", "test-secret-" + "x" * 21)
    monkeypatch.setattr(auth.settings, "supabase_url", "https://example.supabase.co")
    with pytest.raises(auth.AuthError):
        auth._decode("not-a-jwt")


def test_get_current_user_binds_existing_user_by_email(monkeypatch):
    auth_id = uuid4()
    user = User(id=uuid4(), email="user@example.com", is_active=True)

    class DB:
        def __init__(self): self.calls = 0
        def scalar(self, query):
            self.calls += 1
            # First lookup by auth_user_id, then lookup by email.
            return None if self.calls == 1 else user
        def get(self, model, key): return None
        def commit(self): pass
        def refresh(self, obj): pass

    monkeypatch.setattr(auth, "_decode", lambda token: {"sub": str(auth_id), "email": user.email})
    result = get_current_user(SimpleNamespace(credentials="token"), DB())
    assert result is user
    assert user.auth_user_id == auth_id


def test_get_current_user_creates_application_user(monkeypatch):
    auth_id = uuid4()

    class DB:
        def scalar(self, query): return None
        def get(self, model, key): return None
        def add(self, obj): self.user = obj
        def commit(self): pass
        def refresh(self, obj): pass

    db = DB()
    monkeypatch.setattr(auth, "_decode", lambda token: {"sub": str(auth_id), "email": "new@example.com"})
    result = get_current_user(SimpleNamespace(credentials="token"), db)
    assert result.auth_user_id == auth_id
    assert result.email == "new@example.com"


def test_cross_user_ownership_is_forbidden():
    owner = User(id=uuid4(), email="a@example.com", is_active=True)
    other_user_id = uuid4()
    with pytest.raises(HTTPException) as exc:
        require_owner(other_user_id, owner)
    assert exc.value.status_code == 403


def test_same_user_ownership_is_allowed():
    user_id = uuid4()
    owner = User(id=user_id, email="a@example.com", is_active=True)
    require_owner(user_id, owner)
