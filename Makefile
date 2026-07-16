.PHONY: install check test dev

install:
	uv sync --project apps/backend --all-groups
	corepack pnpm --dir apps/web install

check:
	uv run --project apps/backend ruff check apps/backend
	uv run --project apps/backend pyright apps/backend/src apps/backend/tests
	corepack pnpm --dir apps/web check

test:
	uv run --project apps/backend pytest -c apps/backend/pyproject.toml apps/backend/tests
	corepack pnpm --dir apps/web test

dev:
	docker compose up --build
