import hashlib, re
from app.services.normalization import norm_text

def normalize_url(url): return re.sub(r"[?#].*$", "", (url or "").strip().lower().rstrip("/"))
def canonical_key(job):
    if job.source_url: return "url:"+normalize_url(job.source_url)
    return "core:"+"|".join([norm_text(job.company),norm_text(job.title),norm_text(" ".join(job.locations))])
def stable_canonical_id(job): return "job_"+hashlib.sha256(canonical_key(job).encode()).hexdigest()[:24]
def description_fingerprint(description): return hashlib.sha256(norm_text(description).encode()).hexdigest()
