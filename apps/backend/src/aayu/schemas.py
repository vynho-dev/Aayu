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
    content_type: Literal[
        "application/pdf",
        "image/jpeg",
        "image/png",
        "image/webp",
        "audio/mpeg",
        "audio/mp3",
        "audio/wav",
        "audio/x-wav",
        "audio/mp4",
        "audio/x-m4a",
        "audio/webm",
        "audio/aac",
        "audio/ogg",
    ]
    kind: Literal[
        "rejection_letter",
        "policy",
        "bill",
        "discharge_summary",
        "lab_report",
        "prescription",
        "doctor_note",
    ]


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


class ClaimReferenceDocumentView(BaseModel):
    id: str
    title: str
    publisher: str
    document_format: str
    official_url: str
    scope: Literal["mvp", "ombudsman", "both"]
    topics: tuple[str, ...]
    use_in_aayu: str


class AskQuestionRequest(BaseModel):
    question: str = Field(min_length=3, max_length=2000)


class AnswerSourceView(BaseModel):
    document_id: str
    title: str
    official_url: str


class AskQuestionResponse(BaseModel):
    answer: str
    sources: list[AnswerSourceView]


class PolicyAnswerView(BaseModel):
    answer: str
    excerpts: list[str]


class ClaimView(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    status: str
    assessment: dict | None
    appeal_text: str | None
    created_at: datetime


class HealthRecordView(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    data: dict
    updated_at: datetime


class SchemeMatchView(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    scheme_code: str
    explanation: str
    matched: bool


class PolicyDocumentView(BaseModel):
    document_id: uuid.UUID
    status: str
    index_ready: bool


class DocumentSummaryView(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    kind: str
    filename: str
    status: str
    created_at: datetime


EmploymentType = Literal[
    "government_employee_or_pensioner",
    "organized_sector_employee",
    "unorganized_sector_or_self_employed",
    "farmer",
    "unemployed",
]


class EligibilityProfileInput(BaseModel):
    monthly_household_income: float = Field(ge=0)
    employment_type: EmploymentType
    has_bpl_or_antyodaya_ration_card: bool = False
    has_disability: bool = False
    is_pregnant_or_recent_mother: bool = False


class EligibilityMatchView(BaseModel):
    scheme_code: str
    name: str
    authority: str
    benefit_summary: str
    official_url: str
    explanation: str
