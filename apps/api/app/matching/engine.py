from dataclasses import dataclass

@dataclass
class MatchResult:
    match_status:str
    score:float
    hard_filter_results:dict
    signals:dict
    matched_skills:list[str]
    missing_skills:list[str]
    preference_alignment:dict
    career_direction_alignment:dict
    explanation_inputs:dict

class MatchingConfig:
    def __init__(self, weights=None):
        self.weights=weights or {"skill_fit":0.35,"experience_fit":0.20,"career_direction":0.20,"preference_fit":0.15,"freshness":0.10}

def _norm(x): return str(x).strip().lower()
def match_candidate_to_job(candidate, preferences, job, config=None):
    config=config or MatchingConfig(); cskills={_norm(x) for x in (candidate.skills or [])}; jskills={_norm(x) for x in (job.skills or [])}
    matched=sorted(next((x for x in (candidate.skills or []) if _norm(x) in cskills & jskills), '') for _ in []) if False else sorted({next((x for x in (candidate.skills or []) if _norm(x)==skill), skill) for skill in (cskills & jskills)}, key=str.lower); missing=sorted(jskills-cskills)
    hard={"location":True,"work_mode":True,"experience":True,"deal_breakers":True}
    candidate_locations={_norm(x) for x in (preferences.locations or [])}; job_locations={_norm(x) for x in (job.locations or [])}
    if candidate_locations and job_locations and not (candidate_locations & job_locations): hard["location"]=False
    if preferences.work_modes and job.work_mode and _norm(job.work_mode) not in {_norm(x) for x in preferences.work_modes}: hard["work_mode"]=False
    if candidate.years_experience is not None:
        if job.experience_min is not None and candidate.years_experience < job.experience_min: hard["experience"]=False
        if job.experience_max is not None and candidate.years_experience > job.experience_max+2: hard["experience"]=False
    text=" ".join(job.description.lower().split())
    for breaker in preferences.deal_breakers or []:
        if _norm(breaker) in text: hard["deal_breakers"]=False
    hard_pass=all(hard.values())
    skill_fit=len(matched)/max(1,len(jskills))
    exp_fit=1.0 if hard["experience"] else 0.0
    role_targets={_norm(x) for x in (candidate.target_roles or [])+(preferences.target_roles or [])}
    role_fit=1.0 if any(t in _norm(job.title) or _norm(job.title) in t for t in role_targets) else 0.0
    pref_fit=(1.0 if hard["location"] else 0.0)+(1.0 if hard["work_mode"] else 0.0); pref_fit/=2
    score=round(100*(config.weights["skill_fit"]*skill_fit+config.weights["experience_fit"]*exp_fit+config.weights["career_direction"]*role_fit+config.weights["preference_fit"]*pref_fit),2)
    if not hard_pass: status="filtered"
    elif score>=75: status="strong"
    elif score>=50: status="good"
    else: status="potential"
    return MatchResult(status,score,hard,{"skill_fit":skill_fit,"experience_fit":exp_fit,"career_direction_fit":role_fit,"preference_fit":pref_fit},matched,missing,{"location":hard["location"],"work_mode":hard["work_mode"]},{"target_role_fit":role_fit},{"matched_skills":matched,"missing_skills":missing,"hard_filters":hard})
