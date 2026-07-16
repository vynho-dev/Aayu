"""Create the Aayu MVP data foundation."""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op

revision: str = "20260716_01"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None


def _identity_columns() -> list[sa.Column]:
    return [
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column(
            "created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
        ),
    ]


def upgrade() -> None:
    op.create_table(
        "users",
        *_identity_columns(),
        sa.Column("clerk_user_id", sa.String(255), nullable=False),
    )
    op.create_index("ix_users_clerk_user_id", "users", ["clerk_user_id"], unique=True)
    op.create_table(
        "patients",
        *_identity_columns(),
        sa.Column(
            "user_id", sa.Uuid(), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False
        ),
        sa.Column("name", sa.String(120), nullable=False),
        sa.Column("relationship", sa.String(40), nullable=False),
        sa.Column("date_of_birth", sa.Date(), nullable=True),
    )
    op.create_index("ix_patients_user_id", "patients", ["user_id"])
    op.create_table(
        "consents",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column(
            "patient_id",
            sa.Uuid(),
            sa.ForeignKey("patients.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("version", sa.String(40), nullable=False),
        sa.Column(
            "accepted_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
        ),
        sa.UniqueConstraint("patient_id", name="uq_consents_patient"),
    )
    op.create_index("ix_consents_patient_id", "consents", ["patient_id"])
    op.create_table(
        "documents",
        *_identity_columns(),
        sa.Column(
            "patient_id",
            sa.Uuid(),
            sa.ForeignKey("patients.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("kind", sa.String(40), nullable=False),
        sa.Column("filename", sa.String(255), nullable=False),
        sa.Column("content_type", sa.String(100), nullable=False),
        sa.Column("object_key", sa.String(500), nullable=False, unique=True),
        sa.Column("status", sa.String(40), nullable=False),
    )
    op.create_index("ix_documents_patient_id", "documents", ["patient_id"])
    op.create_table(
        "processing_jobs",
        *_identity_columns(),
        sa.Column(
            "document_id",
            sa.Uuid(),
            sa.ForeignKey("documents.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("status", sa.String(40), nullable=False),
        sa.Column("attempts", sa.Integer(), nullable=False),
        sa.Column("error_code", sa.String(100), nullable=True),
        sa.Column(
            "updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
        ),
    )
    op.create_index(
        "ix_processing_jobs_document_id", "processing_jobs", ["document_id"], unique=True
    )
    op.create_table(
        "claims",
        *_identity_columns(),
        sa.Column(
            "patient_id",
            sa.Uuid(),
            sa.ForeignKey("patients.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("status", sa.String(40), nullable=False),
        sa.Column("assessment", sa.JSON(), nullable=True),
        sa.Column("appeal_text", sa.Text(), nullable=True),
        sa.Column("prompt_version", sa.String(80), nullable=True),
    )
    op.create_index("ix_claims_patient_id", "claims", ["patient_id"])
    op.create_table(
        "health_records",
        sa.Column("id", sa.Uuid(), primary_key=True),
        sa.Column(
            "patient_id",
            sa.Uuid(),
            sa.ForeignKey("patients.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("data", sa.JSON(), nullable=False),
        sa.Column("source_version", sa.String(80), nullable=False),
        sa.Column(
            "updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False
        ),
    )
    op.create_index("ix_health_records_patient_id", "health_records", ["patient_id"], unique=True)
    op.create_table(
        "scheme_matches",
        *_identity_columns(),
        sa.Column(
            "patient_id",
            sa.Uuid(),
            sa.ForeignKey("patients.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("scheme_code", sa.String(80), nullable=False),
        sa.Column("explanation", sa.Text(), nullable=False),
        sa.Column("matched", sa.Boolean(), nullable=False),
    )
    op.create_index("ix_scheme_matches_patient_id", "scheme_matches", ["patient_id"])


def downgrade() -> None:
    for table in (
        "scheme_matches",
        "health_records",
        "claims",
        "processing_jobs",
        "documents",
        "consents",
        "patients",
        "users",
    ):
        op.drop_table(table)
