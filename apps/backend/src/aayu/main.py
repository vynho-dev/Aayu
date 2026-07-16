from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from typing import Annotated

from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession

from aayu.config import get_settings
from aayu.database import get_session
from aayu.modules import (
    claim_references,
    consents,
    documents,
    patients,
    policy_chat,
    results,
    scheme_matches,
)


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    get_settings()
    yield


app = FastAPI(title="Aayu API", version="0.1.0", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=get_settings().allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["Authorization", "Content-Type", "X-Dev-User"],
)
app.include_router(patients.router, prefix="/v1")
app.include_router(consents.router, prefix="/v1")
app.include_router(documents.router, prefix="/v1")
app.include_router(claim_references.router, prefix="/v1")
app.include_router(policy_chat.router, prefix="/v1")
app.include_router(results.router, prefix="/v1")
app.include_router(scheme_matches.router, prefix="/v1")


@app.get("/health/live", tags=["health"])
async def live() -> dict[str, str]:
    return {"status": "ok"}


@app.get("/health/ready", tags=["health"])
async def ready(session: Annotated[AsyncSession, Depends(get_session)]) -> dict[str, str]:
    await session.execute(text("SELECT 1"))
    return {"status": "ready"}
