import os
from collections.abc import AsyncIterator

os.environ["AAYU_ENVIRONMENT"] = "test"
os.environ["AAYU_AUTH_MODE"] = "dev"
os.environ["AAYU_DATABASE_URL"] = "sqlite+aiosqlite:///:memory:"

import pytest_asyncio
from httpx import ASGITransport, AsyncClient

from aayu.database import engine
from aayu.main import app
from aayu.models import Base


@pytest_asyncio.fixture(autouse=True)
async def database() -> AsyncIterator[None]:
    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.create_all)
    yield
    async with engine.begin() as connection:
        await connection.run_sync(Base.metadata.drop_all)


@pytest_asyncio.fixture
async def client() -> AsyncIterator[AsyncClient]:
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test",
        headers={"X-Dev-User": "test_user"},
    ) as value:
        yield value
