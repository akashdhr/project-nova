from abc import ABC, abstractmethod
from dataclasses import dataclass, field
from datetime import datetime
from typing import Any

@dataclass
class RawJobRecord:
    source_name: str
    source_job_id: str
    title: str
    company: str
    description: str
    source_url: str | None = None
    application_url: str | None = None
    location: list[str] = field(default_factory=list)
    work_mode: str | None = None
    skills: list[str] = field(default_factory=list)
    experience_min: float | None = None
    experience_max: float | None = None
    salary_min: float | None = None
    salary_max: float | None = None
    salary_currency: str = "INR"
    employment_type: str | None = None
    posted_at: datetime | None = None
    updated_at: datetime | None = None
    payload: dict[str, Any] = field(default_factory=dict)

class JobSourceConnector(ABC):
    source_name: str
    @abstractmethod
    def fetch_jobs(self, cursor: str | None = None, limit: int = 100) -> tuple[list[RawJobRecord], str | None]: ...
    @abstractmethod
    def fetch_job(self, source_job_id: str) -> RawJobRecord | None: ...
    @abstractmethod
    def health_check(self) -> dict: ...
    @abstractmethod
    def normalize(self, record: RawJobRecord): ...
