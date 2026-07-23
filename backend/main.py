from typing import Dict, Optional
from uuid import uuid4

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class RegisterRequest(BaseModel):
    fullName: str
    email: str
    password: str
    role: str = "reader"


class LoginRequest(BaseModel):
    email: str
    password: str


class ProfileUpdateRequest(BaseModel):
    fullName: Optional[str] = None
    email: Optional[str] = None
    role: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None
    readingGoal: Optional[str] = None

from registerbackend import RegisterRequest, register_user, sanitize_user, users_db


class NovelCreate(BaseModel):
    title: str
    author: str
    genre: str
    summary: str
    likes: Optional[int] = 0
    comments: Optional[int] = 0
    cover: Optional[str] = "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80"


class NovelUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    genre: Optional[str] = None
    summary: Optional[str] = None
    likes: Optional[int] = None
    comments: Optional[int] = None
    cover: Optional[str] = None


novels_db: Dict[str, dict] = {
    "1": {
        "id": "1",
        "title": "Moonlit Orchard",
        "author": "Nadia Vale",
        "genre": "Romance",
        "summary": "A tender story of second chances beneath a silver orchard.",
        "likes": 1820,
        "comments": 116,
        "cover": "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80",
    },
    "2": {
        "id": "2",
        "title": "The Silent Harbor",
        "author": "Mika Rowan",
        "genre": "Mystery",
        "summary": "A stormy seaside mystery wrapped in secrets and old promises.",
        "likes": 1540,
        "comments": 98,
        "cover": "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?auto=format&fit=crop&w=900&q=80",
    },
    "3": {
        "id": "3",
        "title": "Velvet Eclipse",
        "author": "Lina Cross",
        "genre": "Fantasy",
        "summary": "A magical adventure where the night sky opens into a kingdom of wonders.",
        "likes": 2260,
        "comments": 143,
        "cover": "https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=900&q=80",
    },
    "4": {
        "id": "4",
        "title": "Paper Lanterns",
        "author": "Ari Sol",
        "genre": "Drama",
        "summary": "An emotional tale of family, memory, and the stories we pass on.",
        "likes": 1320,
        "comments": 89,
        "cover": "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=900&q=80",
    },
}


@app.get("/")
def home():
    return {"message": "Backend is working 🚀"}


@app.get("/health")
def health():
    return {"status": "OK"}


@app.post("/api/auth/register")
def register(payload: RegisterRequest):
    return register_user(payload)


@app.post("/api/auth/login")
def login(payload: LoginRequest):
    normalized_email = payload.email.strip().lower()
    user = users_db.get(normalized_email)
    if not user or user.get("password") != payload.password:
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {"message": "Login successful", "user": sanitize_user(user)}


@app.get("/api/profile/{email}")
def get_profile(email: str):
    normalized_email = email.strip().lower()
    user = users_db.get(normalized_email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return {"user": sanitize_user(user)}


@app.put("/api/profile/{email}")
def update_profile(email: str, payload: ProfileUpdateRequest):
    normalized_email = email.strip().lower()
    user = users_db.get(normalized_email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    if payload.fullName is not None:
        user["fullName"] = payload.fullName.strip()
    if payload.email is not None:
        new_email = payload.email.strip().lower()
        users_db.pop(normalized_email, None)
        user["email"] = new_email
        normalized_email = new_email
        users_db[normalized_email] = user
    if payload.role is not None:
        user["role"] = payload.role
    if payload.bio is not None:
        user["bio"] = payload.bio
    if payload.location is not None:
        user["location"] = payload.location
    if payload.readingGoal is not None:
        user["readingGoal"] = payload.readingGoal

    return {"message": "Profile updated", "user": sanitize_user(user)}


@app.get("/api/novels")
def get_novels():
    return {"novels": list(novels_db.values())}


@app.get("/api/novels/{novel_id}")
def get_novel(novel_id: str):
    novel = novels_db.get(novel_id)
    if not novel:
        raise HTTPException(status_code=404, detail="Novel not found")
    return novel


@app.post("/api/novels")
def create_novel(payload: NovelCreate):
    new_id = str(uuid4())
    novel = {
        "id": new_id,
        "title": payload.title,
        "author": payload.author,
        "genre": payload.genre,
        "summary": payload.summary,
        "likes": payload.likes or 0,
        "comments": payload.comments or 0,
        "cover": payload.cover or "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=900&q=80"
    }
    novels_db[new_id] = novel
    return novel


@app.put("/api/novels/{novel_id}")
def update_novel(novel_id: str, payload: NovelUpdate):
    novel = novels_db.get(novel_id)
    if not novel:
        raise HTTPException(status_code=404, detail="Novel not found")
    
    if payload.title is not None:
        novel["title"] = payload.title
    if payload.author is not None:
        novel["author"] = payload.author
    if payload.genre is not None:
        novel["genre"] = payload.genre
    if payload.summary is not None:
        novel["summary"] = payload.summary
    if payload.likes is not None:
        novel["likes"] = payload.likes
    if payload.comments is not None:
        novel["comments"] = payload.comments
    if payload.cover is not None:
        novel["cover"] = payload.cover
        
    return novel


@app.delete("/api/novels/{novel_id}")
def delete_novel(novel_id: str):
    if novel_id not in novels_db:
        raise HTTPException(status_code=404, detail="Novel not found")
    deleted_novel = novels_db.pop(novel_id)
    return {"message": "Novel deleted successfully", "novel": deleted_novel}