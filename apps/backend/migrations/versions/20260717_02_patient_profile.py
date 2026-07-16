"""Add the structured patient profile used by care, claims, and scheme journeys."""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "20260717_02"
down_revision: str | None = "20260716_01"
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def upgrade() -> None:
    op.add_column(
        "patients",
        sa.Column("profile", sa.JSON(), nullable=False, server_default=sa.text("'{}'")),
    )
    op.alter_column("patients", "profile", server_default=None)


def downgrade() -> None:
    op.drop_column("patients", "profile")
