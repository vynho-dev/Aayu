import pytest
from pydantic import ValidationError

from aayu.config import Settings


def test_production_rejects_development_auth() -> None:
    with pytest.raises(ValidationError):
        Settings(environment="production", auth_mode="dev")
