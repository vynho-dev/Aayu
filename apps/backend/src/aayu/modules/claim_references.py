from typing import Annotated, Literal

import openai
from fastapi import APIRouter, Depends, HTTPException, Query, status

from aayu import grounding
from aayu.auth import get_current_user
from aayu.claim_references import documents_for_scope
from aayu.models import User
from aayu.schemas import (
    AnswerSourceView,
    AskQuestionRequest,
    AskQuestionResponse,
    ClaimReferenceDocumentView,
)

router = APIRouter(prefix="/claim-support", tags=["claim support"])


@router.get("/reference-documents", response_model=list[ClaimReferenceDocumentView])
async def list_reference_documents(
    scope: Literal["all", "mvp", "ombudsman"] = Query(default="all"),
) -> list[ClaimReferenceDocumentView]:
    """List official public sources used to ground claim-assistance guidance."""
    return [
        ClaimReferenceDocumentView(
            id=document.id,
            title=document.title,
            publisher=document.publisher,
            document_format=document.document_format,
            official_url=document.official_url,
            scope=document.scope,
            topics=document.topics,
            use_in_aayu=document.use_in_aayu,
        )
        for document in documents_for_scope(scope)
    ]


@router.post("/ask", response_model=AskQuestionResponse)
async def ask_question(
    payload: AskQuestionRequest,
    _: Annotated[User, Depends(get_current_user)],
) -> AskQuestionResponse:
    """Answer a free-text question grounded in the IRDAI/CIO knowledge base."""
    try:
        result = grounding.answer_question(payload.question)
    except FileNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Knowledge index not built yet - run scripts/build_knowledge_index.py",
        ) from exc
    except openai.OpenAIError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="AI service unavailable, please try again",
        ) from exc

    return AskQuestionResponse(
        answer=result.answer,
        sources=[
            AnswerSourceView(
                document_id=source.document_id,
                title=source.title,
                official_url=source.official_url,
            )
            for source in result.sources
        ],
    )
