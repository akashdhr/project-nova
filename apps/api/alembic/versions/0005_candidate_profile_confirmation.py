"""add candidate profile summary and confirmation state"""
from alembic import op
import sqlalchemy as sa

revision = "0005"
down_revision = "0004"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("candidate_profiles", sa.Column("professional_summary", sa.Text(), nullable=True))
    op.add_column("candidate_profiles", sa.Column("status", sa.String(length=20), nullable=False, server_default="extracted"))
    op.add_column("candidate_profiles", sa.Column("confirmed_at", sa.DateTime(timezone=True), nullable=True))
    op.alter_column("candidate_profiles", "status", server_default=None)


def downgrade():
    op.drop_column("candidate_profiles", "confirmed_at")
    op.drop_column("candidate_profiles", "status")
    op.drop_column("candidate_profiles", "professional_summary")
