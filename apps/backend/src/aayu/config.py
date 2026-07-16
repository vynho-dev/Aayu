from functools import lru_cache
from typing import Literal

from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_prefix="AAYU_", env_file=".env", extra="ignore")

    environment: Literal["development", "test", "staging", "production"] = "development"
    auth_mode: Literal["dev", "clerk"] = "dev"
    database_url: str = "postgresql+psycopg://aayu:aayu@localhost:5432/aayu"
    clerk_issuer: str = ""
    clerk_audience: str = ""
    clerk_authorized_parties: str = "http://localhost:5173"
    aws_region: str = "ap-south-1"
    document_bucket: str = ""
    job_queue_url: str = ""
    cors_origins: str = "http://localhost:5173"
    max_upload_bytes: int = 15 * 1024 * 1024

    @property
    def authorized_parties(self) -> set[str]:
        return {
            value.strip() for value in self.clerk_authorized_parties.split(",") if value.strip()
        }

    @property
    def allowed_origins(self) -> list[str]:
        return [value.strip() for value in self.cors_origins.split(",") if value.strip()]

    @model_validator(mode="after")
    def reject_unsafe_production_settings(self) -> "Settings":
        if self.environment == "production":
            missing = [
                name
                for name, value in {
                    "clerk_issuer": self.clerk_issuer,
                    "document_bucket": self.document_bucket,
                    "job_queue_url": self.job_queue_url,
                }.items()
                if not value
            ]
            if self.auth_mode != "clerk" or missing:
                detail = ", ".join(missing) or "auth_mode=clerk"
                raise ValueError(f"unsafe production configuration: {detail}")
        return self


@lru_cache
def get_settings() -> Settings:
    return Settings()
