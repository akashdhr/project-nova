from __future__ import annotations
import re
from typing import Any
from pydantic import BaseModel, ConfigDict, Field, ValidationError

class EmploymentItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    job_title: str | None = None; company: str | None = None; start_date: str | None = None; end_date: str | None = None
    responsibilities: list[str] = Field(default_factory=list); achievements: list[str] = Field(default_factory=list)
class EducationItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    degree: str | None = None; institution: str | None = None; field_of_study: str | None = None; graduation_year: int | None = None
class CertificationItem(BaseModel):
    model_config = ConfigDict(extra="ignore")
    certification: str | None = None; issuer: str | None = None; date: str | None = None
class ExtractedProfile(BaseModel):
    model_config = ConfigDict(extra="ignore")
    professional_summary: str | None = None; current_role: str | None = None; current_company: str | None = None; years_experience: float | None = None
    employment_history: list[EmploymentItem] = Field(default_factory=list); skills: list[str] = Field(default_factory=list); technologies: list[str] = Field(default_factory=list)
    education: list[EducationItem] = Field(default_factory=list); certifications: list[CertificationItem] = Field(default_factory=list)

def _clean_string(value: Any) -> str | None:
    if value is None: return None
    value = str(value).strip()
    return value[:2000] if value else None

def sanitize_for_ai(text: str) -> str:
    text = re.sub(r"\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b", "[EMAIL REMOVED]", text, flags=re.I)
    text = re.sub(r"(?<!\d)(?:\+?\d[\d .()\-]{7,}\d)(?!\d)", "[PHONE REMOVED]", text)
    return "\n".join("Address: [ADDRESS REMOVED]" if re.match(r"^\s*(address|home address|residential address|street address)\s*[:\-]", line, flags=re.I) else line for line in text.splitlines())

def validate_extraction(raw: dict) -> ExtractedProfile:
    if not isinstance(raw, dict): raise ValueError("AI response must be an object")
    try: profile = ExtractedProfile.model_validate(raw)
    except ValidationError as exc: raise ValueError("Invalid AI career profile") from exc
    if profile.years_experience is not None and not (0 <= profile.years_experience <= 80): raise ValueError("Invalid experience value")
    return profile

def profile_to_candidate_fields(profile: ExtractedProfile) -> dict:
    history = [item.model_dump() for item in profile.employment_history]
    companies=[]
    if profile.current_company: companies.append(profile.current_company)
    for item in history:
        if item.get("company") and item["company"] not in companies: companies.append(item["company"])
    return {
        "professional_summary": _clean_string(profile.professional_summary), "current_role": _clean_string(profile.current_role), "current_company": _clean_string(profile.current_company), "years_experience": profile.years_experience,
        "skills": [str(s).strip()[:200] for s in profile.skills if str(s).strip()][:100], "technologies": [str(s).strip()[:200] for s in profile.technologies if str(s).strip()][:100],
        "companies": [str(c).strip()[:300] for c in companies if str(c).strip()][:100], "education": [item.model_dump() for item in profile.education], "certifications": [item.model_dump() for item in profile.certifications],
        "previous_roles": history, "career_direction": None, "target_roles": [],
    }
