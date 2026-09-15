import asyncio
from uuid import uuid4
from types import SimpleNamespace
import pytest
from fastapi import HTTPException
from app.main import upload_resume
from app.models.entities import User

class FakeUpload:
    def __init__(self, content_type='text/plain', content=b'Engineer\nPython'):
        self.content_type=content_type; self.filename='resume.txt'; self._content=content
    async def read(self): return self._content

def test_invalid_resume_format_rejected_before_storage():
    uid=uuid4(); user=User(id=uid,email='a@example.com',is_active=True)
    with pytest.raises(HTTPException) as exc:
        asyncio.run(upload_resume(uid,FakeUpload('application/octet-stream'),SimpleNamespace(),user))
    assert exc.value.status_code==415

def test_empty_resume_rejected():
    uid=uuid4(); user=User(id=uid,email='a@example.com',is_active=True)
    with pytest.raises(HTTPException) as exc:
        asyncio.run(upload_resume(uid,FakeUpload('text/plain',b'   '),SimpleNamespace(),user))
    assert exc.value.status_code==400
