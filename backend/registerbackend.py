from typing import Dict
from uuid import uuid4

from fastapi import HTTPException
from pydantic import BaseModel

users_db: Dict[str, dict] = {}


class RegisterRequest(BaseModel):
    fullName: str
    email: str
    password: str
    role: str = "reader"


def sanitize_user(user: dict) -> dict:
    safe_user = dict(user)
    safe_user.pop("password", None)
    return safe_user


def register_user(payload: RegisterRequest):
    normalized_email = payload.email.strip().lower()
    if normalized_email in users_db:
        raise HTTPException(status_code=409, detail="User already exists")

    user = {
        "id": str(uuid4()),
        "fullName": payload.fullName.strip(),
        "email": normalized_email,
        "password": payload.password,
        "role": payload.role or "reader",
        "bio": "Curious reader exploring romance, thrillers, and fantasy.",
        "location": "Seattle, USA",
        "readingGoal": "Finish 2 novels this month",
    }
    users_db[normalized_email] = user
    return {"message": "Account created", "user": sanitize_user(user)}
