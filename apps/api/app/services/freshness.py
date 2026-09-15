from datetime import datetime, timedelta, timezone

def is_stale(last_seen_at, stale_after_days): return last_seen_at < datetime.now(timezone.utc)-timedelta(days=stale_after_days)
def apply_freshness(job, stale_after_days): job.status = "stale" if is_stale(job.last_seen_at, stale_after_days) else "active"
