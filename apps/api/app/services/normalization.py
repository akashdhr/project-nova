import re
from dataclasses import dataclass
from app.connectors.base import RawJobRecord

def clean(s): return re.sub(r"\s+", " ", (s or "").strip())
def norm_text(s): return re.sub(r"[^a-z0-9]+", " ", clean(s).lower()).strip()
def normalize_title(title):
    t=clean(title)
    t=re.sub(r"\b(II|III|IV|2|3|4|L[0-9]+)\b", "", t, flags=re.I)
    t=re.sub(r"\s*[-–—]?\s*(l[0-9]+|level\s*[0-9]+)\s*$", "", t, flags=re.I)
    return clean(t).rstrip("-–— ")
def normalize_company(name): return clean(name).lower().replace("private limited","pvt ltd")
def normalize_location(locations): return [clean(x) for x in locations if clean(x)]
@dataclass
class NormalizedJob:
    title:str; original_title:str; company:str; description:str; skills:list[str]; locations:list[str]; work_mode:str|None; experience_min:float|None; experience_max:float|None; salary_min:float|None; salary_max:float|None; salary_currency:str; employment_type:str|None; posted_at:any; updated_at:any; source_url:str|None; application_url:str|None; source_job_id:str; source_name:str; payload:dict

def normalize_raw_job(r:RawJobRecord)->NormalizedJob:
    return NormalizedJob(normalize_title(r.title),clean(r.title),normalize_company(r.company),clean(r.description),sorted({clean(s) for s in r.skills if clean(s)},key=str.lower),normalize_location(r.location),r.work_mode.lower().replace(" ","_") if r.work_mode else None,r.experience_min,r.experience_max,r.salary_min,r.salary_max,r.salary_currency,r.employment_type,r.posted_at,r.updated_at,r.source_url,r.application_url,r.source_job_id,r.source_name,r.payload)
