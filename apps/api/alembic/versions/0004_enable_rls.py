from alembic import op

revision = "0004"
down_revision = "0003"
branch_labels = None
depends_on = None


TABLES = [
    "users",
    "candidate_profiles",
    "career_preferences",
    "companies",
    "jobs",
    "external_job_references",
    "job_sources",
    "job_matches",
    "recommendations",
    "user_interactions",
    "recommendation_feedback",
    "job_embeddings",
    "resumes",
    "alembic_version",
]


def upgrade() -> None:
    for table in TABLES:
        op.execute(f'ALTER TABLE public."{table}" ENABLE ROW LEVEL SECURITY')


def downgrade() -> None:
    for table in reversed(TABLES):
        op.execute(f'ALTER TABLE public."{table}" DISABLE ROW LEVEL SECURITY')
