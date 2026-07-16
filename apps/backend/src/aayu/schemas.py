import uuid
from datetime import date, datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class PatientCreate(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    relationship: str = Field(min_length=1, max_length=40)
    date_of_birth: date | None = None


class PatientView(PatientCreate):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID


class ConsentCreate(BaseModel):
    accepted: Literal[True]
    version: str = Field(default="2026-07-16", min_length=1, max_length=40)


class ConsentView(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    patient_id: uuid.UUID
    version: str
    accepted_at: datetime


class UploadIntentCreate(BaseModel):
    filename: str = Field(min_length=1, max_length=255)
    content_type: Literal["application/pdf", "image/jpeg", "image/png", "image/webp"]
    kind: Literal["rejection_letter", "policy", "bill", "discharge_summary"]


class UploadIntentView(BaseModel):
    document_id: uuid.UUID
    upload_url: str
    method: Literal["PUT"] = "PUT"
    headers: dict[str, str]


class JobView(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    document_id: uuid.UUID
    status: str
    error_code: str | None
    created_at: datetime
    updated_at: datetime
