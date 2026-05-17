from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .models import RollRequest, RollResponse, ValidateResponse
from .dice import roll
from .validator import validate

app = FastAPI(title="Night Creatures API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
def health():
    return {"status": "ok", "game": "Vampire: The Masquerade V5"}


@app.post("/api/roll", response_model=RollResponse)
def roll_dice(req: RollRequest) -> RollResponse:
    return roll(req.pool, req.hunger, req.difficulty)


@app.post("/api/validate", response_model=ValidateResponse)
def validate_sheet(character: dict) -> ValidateResponse:
    return validate(character)
