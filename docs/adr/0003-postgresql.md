# ADR 0003: PostgreSQL and migrations

RDS PostgreSQL is the source of truth. SQLAlchemy 2 manages persistence and Alembic manages forward-only schema changes. Production connects through RDS Proxy; PgBouncer is optional for local parity and is never stacked with RDS Proxy.
