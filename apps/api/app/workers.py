"""Lightweight scheduled-worker entry points.

Run these from a scheduler/cron or a single worker process. No broker is required for Phase 1.
"""
from app.db.session import SessionLocal
from app.core.config import settings
from app.services.ingestion import ingest_records
from app.connectors.mock import MockJobSourceConnector

def refresh_jobs(connector):
    with SessionLocal() as db:
        records, _ = connector.fetch_jobs(limit=500)
        return ingest_records(db, connector, records, settings.stale_after_days)

def refresh_mock_jobs():
    return refresh_jobs(MockJobSourceConnector([]))

if __name__ == "__main__":
    refresh_mock_jobs()
