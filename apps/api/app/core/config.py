from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Talvion"
    database_url: str = "postgresql+psycopg://postgres:postgres@localhost:5432/career_agent"
    app_env: str = "development"
    openai_api_key: str | None = None
    openai_base_url: str | None = None
    openai_model: str = "gpt-5-mini"
    openai_embedding_model: str = "text-embedding-3-small"
    openai_timeout_seconds: float = 30.0
    supabase_url: str | None = None
    supabase_jwt_secret: str | None = None
    supabase_service_role_key: str | None = None
    supabase_storage_bucket: str = "resumes"
    resume_storage_path: str = "./storage/resumes"
    resume_max_bytes: int = 5 * 1024 * 1024
    stale_after_days: int = 14
    rate_limit_per_minute: int = 120
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    @property
    def supabase_issuer(self) -> str | None:
        return f"{self.supabase_url.rstrip('/')}/auth/v1" if self.supabase_url else None


settings = Settings()
