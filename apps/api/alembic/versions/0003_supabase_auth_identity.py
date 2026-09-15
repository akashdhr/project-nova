"""map Supabase Auth identities to application users"""
from alembic import op
import sqlalchemy as sa

revision = "0003"
down_revision = "0002"
branch_labels = None
depends_on = None


def upgrade():
    op.add_column("users", sa.Column("auth_user_id", sa.UUID(), nullable=True))
    op.create_unique_constraint("uq_users_auth_user_id", "users", ["auth_user_id"])
    op.create_index("ix_users_auth_user_id", "users", ["auth_user_id"])


def downgrade():
    op.drop_index("ix_users_auth_user_id", table_name="users")
    op.drop_constraint("uq_users_auth_user_id", "users", type_="unique")
    op.drop_column("users", "auth_user_id")
