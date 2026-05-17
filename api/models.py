from pydantic import BaseModel, Field
from typing import Literal


class RollRequest(BaseModel):
    pool: int = Field(ge=1, le=30)
    hunger: int = Field(ge=0, le=5)
    difficulty: int = Field(ge=1, le=10, default=1)


ResultType = Literal[
    "critical_win", "messy_critical", "success", "failure", "bestial_failure"
]


class RollResponse(BaseModel):
    regular_dice: list[int]
    hunger_dice: list[int]
    successes: int
    result_type: ResultType
    difficulty_met: bool
    margin: int


class ValidationIssue(BaseModel):
    field: str
    message: str


class ValidateResponse(BaseModel):
    valid: bool
    errors: list[ValidationIssue]
    warnings: list[ValidationIssue]
