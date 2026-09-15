"""pgvector support and resume metadata"""
from alembic import op
import sqlalchemy as sa

revision="0002"
down_revision="0001"
branch_labels=None
depends_on=None

def upgrade():
    # op.execute("CREATE EXTENSION IF NOT EXISTS vector")
    # op.execute("ALTER TABLE job_embeddings ADD COLUMN IF NOT EXISTS embedding vector(1536)")
    # op.execute("CREATE INDEX IF NOT EXISTS ix_job_embeddings_embedding ON job_embeddings USING hnsw (embedding vector_cosine_ops)")
    op.add_column("resumes", sa.Column("ai_extraction", sa.JSON(), nullable=False, server_default=sa.text("'{}'::jsonb")))
    op.add_column("resumes", sa.Column("file_size_bytes", sa.Integer(), nullable=True))
    op.add_column("resumes", sa.Column("storage_provider", sa.String(length=30), nullable=False, server_default="local"))

def downgrade():
    op.drop_column("resumes","ai_extraction")
    op.drop_column("resumes","storage_provider")
    op.drop_column("resumes","file_size_bytes")
    op.execute("DROP INDEX IF EXISTS ix_job_embeddings_embedding")
    op.execute("ALTER TABLE job_embeddings DROP COLUMN IF EXISTS embedding")
