import uuid
from typing import Annotated

import openai
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from aayu import policy_chat
from aayu.auth import get_current_user
from aayu.database import get_session
from aayu.models import DocumentStatus, User
from aayu.modules.documents import owned_document
from aayu.schemas import AskQuestionRequest, PolicyAnswerView

router = APIRouter(tags=["policy chat"])


@router.post(
    "/patients/{patient_id}/documents/{document_id}/policy-chat",
    response_model=PolicyAnswerView,
)
async def ask_policy_question(
    patient_id: uuid.UUID,
    document_id: uuid.UUID,
    payload: AskQuestionRequest,
    user: Annotated[User, Depends(get_current_user)],
    session: Annotated[AsyncSession, Depends(get_session)],
) -> PolicyAnswerView:
    """Answer a free-text question grounded only in this patient's own uploaded policy."""
    document = await owned_document(document_id, user, session)
    if document.patient_id != patient_id:
        raise HTTPException(status_code=404, detail="Document not found")
    if document.kind != "policy":
        raise HTTPException(
            status_code=422, detail="This endpoint only answers questions about policy documents"
        )
    if document.status == DocumentStatus.pending_upload.value:
        raise HTTPException(status_code=409, detail="Upload has not completed")

    try:
        result = policy_chat.ask(patient_id, document_id, document.object_key, payload.question)
    except FileNotFoundError as exc:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="Uploaded file is missing from storage"
        ) from exc
    except ValueError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc
    except openai.OpenAIError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="AI service unavailable, please try again",
        ) from exc

    return PolicyAnswerView(answer=result.answer, excerpts=result.excerpts)
