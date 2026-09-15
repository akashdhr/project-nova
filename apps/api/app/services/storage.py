from __future__ import annotations
from pathlib import Path
import re
import httpx
from app.core.config import settings

class ResumeStorage:
    def _safe(self, name: str) -> str:
        return re.sub(r"[^A-Za-z0-9._-]", "_", Path(name).name)[:180] or "resume"

    async def save(self, user_id: str, filename: str, content: bytes, content_type: str) -> str:
        key=f"user/{user_id}/resume/{self._safe(filename)}"
        if settings.supabase_url and settings.supabase_service_role_key:
            url=f"{settings.supabase_url.rstrip('/')}/storage/v1/object/{settings.supabase_storage_bucket}/{key}"
            headers={"Authorization":f"Bearer {settings.supabase_service_role_key}","apikey":settings.supabase_service_role_key,"Content-Type":content_type,"x-upsert":"true"}
            async with httpx.AsyncClient(timeout=30) as client:
                r=await client.post(url,content=content,headers=headers); r.raise_for_status()
        else:
            path=Path(settings.resume_storage_path)/key
            path.parent.mkdir(parents=True,exist_ok=True); path.write_bytes(content)
        return key

storage=ResumeStorage()
