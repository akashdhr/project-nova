from datetime import datetime, timezone
from app.connectors.base import JobSourceConnector, RawJobRecord
from app.services.normalization import normalize_raw_job

class MockJobSourceConnector(JobSourceConnector):
    source_name="mock"
    def __init__(self, records=None): self.records=records or []
    def fetch_jobs(self,cursor=None,limit=100): return self.records[:limit], None
    def fetch_job(self,source_job_id): return next((r for r in self.records if r.source_job_id==source_job_id),None)
    def health_check(self): return {"status":"healthy","source":self.source_name,"checked_at":datetime.now(timezone.utc).isoformat()}
    def normalize(self,record): return normalize_raw_job(record)
