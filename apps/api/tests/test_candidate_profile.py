from uuid import uuid4
import pytest
from app.core.auth import require_owner
from app.main import confirm_candidate, get_candidate, put_candidate
from app.models.entities import CandidateProfile, User
from app.schemas.core import CandidateProfileIn

class FakeDB:
    def __init__(self, profile=None): self.profile=profile
    def scalar(self, query): return self.profile
    def add(self, obj): self.profile=obj
    def commit(self): pass
    def refresh(self, obj): pass

def test_profile_created_and_edited():
    uid=uuid4(); user=User(id=uid,email='a@example.com',is_active=True); db=FakeDB()
    result=put_candidate(uid,CandidateProfileIn(current_role='Engineer',skills=['Python']),db,user)
    assert result.current_role=='Engineer'; assert result.skills==['Python']; assert result.status=='edited'

def test_profile_retrieved():
    uid=uuid4(); p=CandidateProfile(user_id=uid,current_role='Engineer',status='extracted'); user=User(id=uid,email='a@example.com',is_active=True); db=FakeDB(p)
    assert get_candidate(uid,db,user) is p

def test_profile_confirmed():
    uid=uuid4(); p=CandidateProfile(user_id=uid,current_role='Engineer',status='edited'); user=User(id=uid,email='a@example.com',is_active=True); db=FakeDB(p)
    result=confirm_candidate(uid,db,user)
    assert result.status=='confirmed'; assert result.confirmed_at is not None

def test_cross_user_profile_access_rejected():
    owner=User(id=uuid4(),email='a@example.com',is_active=True)
    with pytest.raises(Exception): require_owner(uuid4(),owner)
