from datetime import datetime
from uuid import UUID
from pydantic import BaseModel, ConfigDict, Field
class UserCreate(BaseModel): email: str; name: str | None=None; phone: str | None=None
class UserOut(UserCreate): model_config=ConfigDict(from_attributes=True); id: UUID
class EmploymentItem(BaseModel):
    job_title: str | None=None; company: str | None=None; start_date: str | None=None; end_date: str | None=None; responsibilities:list[str]=Field(default_factory=list); achievements:list[str]=Field(default_factory=list)
class EducationItem(BaseModel):
    degree: str | None=None; institution: str | None=None; field_of_study: str | None=None; graduation_year:int|None=None
class CertificationItem(BaseModel): certification:str|None=None; issuer:str|None=None; date:str|None=None
class CandidateProfileIn(BaseModel):
    professional_summary:str|None=None; current_role:str|None=None; current_company:str|None=None; years_experience:float|None=None; skills:list[str]=Field(default_factory=list); technologies:list[str]=Field(default_factory=list); companies:list[str]=Field(default_factory=list); education:list[EducationItem]=Field(default_factory=list); certifications:list[CertificationItem]=Field(default_factory=list); career_direction:str|None=None; target_roles:list[str]=Field(default_factory=list); previous_roles:list[EmploymentItem]=Field(default_factory=list)
class CandidateProfileOut(CandidateProfileIn):
    model_config=ConfigDict(from_attributes=True); id:UUID; user_id:UUID; status:str; confirmed_at:datetime|None=None
class PreferencesIn(BaseModel): target_roles:list[str]=Field(default_factory=list); locations:list[str]=Field(default_factory=list); relocation_preference:str|None=None; work_modes:list[str]=Field(default_factory=list); min_compensation:float|None=None; max_compensation:float|None=None; compensation_currency:str="INR"; industries:list[str]=Field(default_factory=list); preferred_companies:list[str]=Field(default_factory=list); deal_breakers:list[str]=Field(default_factory=list); job_priorities:list[str]=Field(default_factory=list)
class PreferencesOut(PreferencesIn): model_config=ConfigDict(from_attributes=True); id:UUID; user_id:UUID
class JobOut(BaseModel):
    model_config=ConfigDict(from_attributes=True); id:UUID; canonical_id:str; title:str; original_title:str; description:str; skills:list; locations:list; work_mode:str|None; experience_min:float|None; experience_max:float|None; salary_min:float|None; salary_max:float|None; salary_currency:str|None; employment_type:str|None; posted_at:datetime|None; last_seen_at:datetime; source_url:str|None; application_url:str|None; credibility_signals:dict
class RecommendationOut(BaseModel): recommendation_id:UUID; job:JobOut; match_label:str; explanation:str|None; rank_position:int
class InteractionIn(BaseModel): metadata:dict=Field(default_factory=dict); rejection_reason:str|None=None
class FeedbackIn(BaseModel): feedback_type:str; reason:str|None=None; metadata:dict=Field(default_factory=dict)
