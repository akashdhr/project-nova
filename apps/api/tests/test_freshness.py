from datetime import datetime,timezone,timedelta
from app.services.freshness import is_stale

def test_stale(): assert is_stale(datetime.now(timezone.utc)-timedelta(days=20),14)
def test_fresh(): assert not is_stale(datetime.now(timezone.utc)-timedelta(days=2),14)
