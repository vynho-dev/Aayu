from dataclasses import dataclass
from functools import lru_cache
from typing import Annotated

import jwt
from fastapi import Depends, Header, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt.types import Options
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from aayu.config import get_settings
from aayu.database import get_session
from aayu.models import User

bearer = HTTPBearer(auto_error=False)


@dataclass(frozen=True)
class Identity:
    clerk_user_id: str


@lru_cache
def _jwk_client(issuer: str) -> jwt.PyJWKClient:
    return jwt.PyJWKClient(f"{issuer.rstrip('/')}/.well-known/jwks.json")


def _verify_clerk_token(token: str) -> Identity:
    settings = get_settings()
    try:
        key = _jwk_client(settings.clerk_issuer).get_signing_key_from_jwt(token)
        options: Options = {"verify_aud": bool(settings.clerk_audience)}
        claims = jwt.decode(
            token,
            key.key,
            algorithms=["RS256"],
            audience=settings.clerk_audience or None,
            issuer=settings.clerk_issuer,
            options=options,
        )
    except jwt.PyJWTError as exc:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid session"
        ) from exc

    authorized_parties = settings.authorized_parties
    if authorized_parties and claims.get("azp") not in authorized_parties:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid session origin"
        )
    subject = claims.get("sub")
    if not isinstance(subject, str) or not subject:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid session subject"
        )
    return Identity(subject)


async def get_identity(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer)],
    dev_user: Annotated[str | None, Header(alias="X-Dev-User")] = None,
) -> Identity:
    settings = get_settings()
    if settings.auth_mode == "dev":
        if settings.environment not in {"development", "test"}:
            raise HTTPException(status_code=500, detail="Development authentication is disabled")
        return Identity(dev_user or "dev_user")
    if credentials is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Sign in required")
    return _verify_clerk_token(credentials.credentials)


async def get_current_user(
    identity: Annotated[Identity, Depends(get_identity)],
    session: Annotated[AsyncSession, Depends(get_session)],
) -> User:
    user = await session.scalar(select(User).where(User.clerk_user_id == identity.clerk_user_id))
    if user is None:
        user = User(clerk_user_id=identity.clerk_user_id)
        session.add(user)
        try:
            await session.commit()
        except IntegrityError:
            await session.rollback()
            user = await session.scalar(
                select(User).where(User.clerk_user_id == identity.clerk_user_id)
            )
            if user is None:
                raise
        await session.refresh(user)
    return user
