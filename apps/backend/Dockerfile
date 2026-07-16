FROM python:3.12-slim AS runtime

ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 PATH="/app/.venv/bin:$PATH"
WORKDIR /app

COPY --from=ghcr.io/astral-sh/uv:0.10.7 /uv /uvx /bin/
COPY pyproject.toml uv.lock ./
RUN uv sync --frozen --no-dev --no-install-project

COPY alembic.ini ./
COPY migrations migrations
COPY src src
RUN uv sync --frozen --no-dev

USER 65532:65532
EXPOSE 8000
CMD ["uvicorn", "aayu.main:app", "--host", "0.0.0.0", "--port", "8000", "--proxy-headers"]
