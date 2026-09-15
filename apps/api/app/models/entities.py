import enum, uuid
from datetime import datetime, timezone
from sqlalchemy import Boolean, DateTime, Enum, Float, ForeignKey, Index, Integer, String, Text, UniqueConstraint, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.db.session import Base

def now(): return datetime.now(timezone.utc)
class JobStatus(str, enum.Enum): ACTIVE="active"; STALE="stale"; CLOSED="closed"
class SourceStatus(str, enum.Enum): ACTIVE="active"; DEGRADED="degraded"; DISABLED="disabled"
class InteractionType(str, enum.Enum): VIEWED="viewed"; SAVED="saved"; APPLY_CLICK="apply_click"; NOT_INTERESTED="not_interested"; REJECTION_REASON="rejection_reason"
class RecommendationStatus(str, enum.Enum): ACTIVE="active"; DISMISSED="dismissed"; EXPIRED="expired"
class CandidateProfileStatus(str, enum.Enum): EXTRACTED="extracted"; EDITED="edited"; CONFIRMED="confirmed"
class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now, onupdate=now, nullable=False)
class User(TimestampMixin, Base):
    __tablename__="users"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    auth_user_id: Mapped[uuid.UUID | None] = mapped_column(UUID(as_uuid=True), unique=True, index=True)
    email: Mapped[str] = mapped_column(String(320), unique=True, nullable=False, index=True)
    name: Mapped[str | None] = mapped_column(String(200)); phone: Mapped[str | None] = mapped_column(String(50)); avatar_url: Mapped[str | None] = mapped_column(String(500))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    candidate_profile = relationship("CandidateProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    preferences = relationship("CareerPreferences", back_populates="user", uselist=False, cascade="all, delete-orphan")
class CandidateProfile(TimestampMixin, Base):
    __tablename__="candidate_profiles"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    professional_summary: Mapped[str | None] = mapped_column(Text)
    current_role: Mapped[str | None] = mapped_column("current_role", String(200), quote=True)
    current_company: Mapped[str | None] = mapped_column(String(300))
    years_experience: Mapped[float | None] = mapped_column(Float)
    skills: Mapped[list] = mapped_column(JSON, default=list); technologies: Mapped[list] = mapped_column(JSON, default=list)
    companies: Mapped[list] = mapped_column(JSON, default=list); education: Mapped[list] = mapped_column(JSON, default=list)
    certifications: Mapped[list] = mapped_column(JSON, default=list); career_direction: Mapped[str | None] = mapped_column(Text)
    target_roles: Mapped[list] = mapped_column(JSON, default=list); previous_roles: Mapped[list] = mapped_column(JSON, default=list)
    status: Mapped[str] = mapped_column(String(20), default=CandidateProfileStatus.EXTRACTED.value, nullable=False)
    confirmed_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True))
    user = relationship("User", back_populates="candidate_profile")
class CareerPreferences(TimestampMixin, Base):
    __tablename__="career_preferences"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    target_roles: Mapped[list] = mapped_column(JSON, default=list); locations: Mapped[list] = mapped_column(JSON, default=list)
    relocation_preference: Mapped[str | None] = mapped_column(String(50)); work_modes: Mapped[list] = mapped_column(JSON, default=list)
    min_compensation: Mapped[float | None] = mapped_column(Float); max_compensation: Mapped[float | None] = mapped_column(Float)
    compensation_currency: Mapped[str] = mapped_column(String(10), default="INR"); industries: Mapped[list] = mapped_column(JSON, default=list)
    preferred_companies: Mapped[list] = mapped_column(JSON, default=list); deal_breakers: Mapped[list] = mapped_column(JSON, default=list)
    job_priorities: Mapped[list] = mapped_column(JSON, default=list); user = relationship("User", back_populates="preferences")
class Resume(TimestampMixin, Base):
    __tablename__="resumes"
    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    storage_key: Mapped[str] = mapped_column(String(500), nullable=False); filename: Mapped[str] = mapped_column(String(255), nullable=False)
    content_type: Mapped[str] = mapped_column(String(100), nullable=False); extracted_text: Mapped[str | None] = mapped_column(Text)
    extraction_status: Mapped[str] = mapped_column(String(30), default="pending", nullable=False); ai_extraction: Mapped[dict] = mapped_column(JSON, default=dict)
    is_current: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False); file_size_bytes: Mapped[int | None] = mapped_column(Integer)
    storage_provider: Mapped[str] = mapped_column(String(30), default="local", nullable=False)
class Company(TimestampMixin, Base):
    __tablename__="companies"; id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4); canonical_name: Mapped[str] = mapped_column(String(300), unique=True, nullable=False, index=True); display_name: Mapped[str] = mapped_column(String(300), nullable=False); website: Mapped[str | None] = mapped_column(String(500))
class JobSource(TimestampMixin, Base):
    __tablename__="job_sources"; id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4); name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False); status: Mapped[SourceStatus] = mapped_column(Enum(SourceStatus), default=SourceStatus.ACTIVE, nullable=False); last_health_check_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True)); last_refresh_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True)); metadata_json: Mapped[dict] = mapped_column(JSON, default=dict)
class Job(TimestampMixin, Base):
    __tablename__="jobs"; id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4); canonical_id: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True); company_id: Mapped[uuid.UUID | None] = mapped_column(ForeignKey("companies.id"), index=True); title: Mapped[str] = mapped_column(String(500)); original_title: Mapped[str] = mapped_column(String(500)); description: Mapped[str] = mapped_column(Text); skills: Mapped[list] = mapped_column(JSON, default=list); experience_min: Mapped[float | None] = mapped_column(Float); experience_max: Mapped[float | None] = mapped_column(Float); locations: Mapped[list] = mapped_column(JSON, default=list); work_mode: Mapped[str | None] = mapped_column(String(50)); salary_min: Mapped[float | None] = mapped_column(Float); salary_max: Mapped[float | None] = mapped_column(Float); salary_currency: Mapped[str] = mapped_column(String(10), default="INR"); employment_type: Mapped[str | None] = mapped_column(String(50)); posted_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), index=True); source_updated_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True)); first_seen_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now, nullable=False); last_seen_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now, nullable=False, index=True); status: Mapped[JobStatus] = mapped_column(Enum(JobStatus), default=JobStatus.ACTIVE, nullable=False, index=True); source_url: Mapped[str | None] = mapped_column(String(1000)); application_url: Mapped[str | None] = mapped_column(String(1000)); source_data: Mapped[dict] = mapped_column(JSON, default=dict); ai_enrichment: Mapped[dict] = mapped_column(JSON, default=dict); credibility_signals: Mapped[dict] = mapped_column(JSON, default=dict); company = relationship("Company")
class ExternalJobReference(TimestampMixin, Base):
    __tablename__="external_job_references"; id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4); job_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False, index=True); source_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("job_sources.id", ondelete="CASCADE"), nullable=False, index=True); source_job_id: Mapped[str] = mapped_column(String(500), nullable=False); source_url: Mapped[str | None] = mapped_column(String(1000)); raw_payload: Mapped[dict] = mapped_column(JSON, default=dict); last_seen_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=now, nullable=False); __table_args__=(UniqueConstraint("source_id","source_job_id",name="uq_source_job"),)
class JobEmbedding(TimestampMixin, Base):
    __tablename__="job_embeddings"; id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4); job_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("jobs.id", ondelete="CASCADE"), unique=True, nullable=False); model_name: Mapped[str] = mapped_column(String(100), nullable=False); vector_json: Mapped[list | None] = mapped_column(JSON); source_hash: Mapped[str | None] = mapped_column(String(128)); embedding: Mapped[list | None] = mapped_column(JSON)
class JobMatch(TimestampMixin, Base):
    __tablename__="job_matches"; id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4); user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True); job_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False, index=True); match_status: Mapped[str] = mapped_column(String(50), nullable=False); score: Mapped[float] = mapped_column(Float, nullable=False); signals: Mapped[dict] = mapped_column(JSON, default=dict); hard_filter_results: Mapped[dict] = mapped_column(JSON, default=dict); explanation_inputs: Mapped[dict] = mapped_column(JSON, default=dict); __table_args__=(UniqueConstraint("user_id","job_id",name="uq_user_job_match"),)
class Recommendation(TimestampMixin, Base):
    __tablename__="recommendations"; id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4); user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True); job_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False, index=True); match_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("job_matches.id", ondelete="CASCADE"), nullable=False); rank_position: Mapped[int] = mapped_column(Integer, nullable=False); match_label: Mapped[str] = mapped_column(String(50), nullable=False); explanation: Mapped[str | None] = mapped_column(Text); status: Mapped[RecommendationStatus] = mapped_column(Enum(RecommendationStatus), default=RecommendationStatus.ACTIVE, nullable=False)
class UserInteraction(TimestampMixin, Base):
    __tablename__="user_interactions"; id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4); user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True); job_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False, index=True); interaction_type: Mapped[InteractionType] = mapped_column(Enum(InteractionType), nullable=False); metadata_json: Mapped[dict] = mapped_column(JSON, default=dict)
class RecommendationFeedback(TimestampMixin, Base):
    __tablename__="recommendation_feedback"; id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4); recommendation_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("recommendations.id", ondelete="CASCADE"), nullable=False, index=True); user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), nullable=False); feedback_type: Mapped[str] = mapped_column(String(50), nullable=False); reason: Mapped[str | None] = mapped_column(String(300)); metadata_json: Mapped[dict] = mapped_column(JSON, default=dict)
Index("ix_jobs_dedupe", Job.title, Job.company_id, Job.work_mode)
