"""store current company on candidate profile"""
from alembic import op
import sqlalchemy as sa

revision = "0006"
down_revision = "0005"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("candidate_profiles", sa.Column("current_company", sa.String(length=300), nullable=True))


def downgrade():
    op.drop_column("candidate_profiles", "current_company")
