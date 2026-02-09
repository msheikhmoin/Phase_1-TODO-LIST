from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from database import get_session_dependency as get_session
from sqlmodel import Session, select
from typing import List
import os
from datetime import timedelta
from pydantic import BaseModel
import cohere

# Models aur Auth imports
from auth import get_password_hash, authenticate_user, create_access_token, get_current_user
from models import User, ChatHistory, Task

app = FastAPI(title="Phase 3 Todo AI Chatbot")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str

# --- Task Routes (Fixing 404) ---
@app.get("/tasks")
async def get_tasks(current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    return session.exec(select(Task).where(Task.user_id == current_user.id)).all()

# --- Chat Route (Fixing 500) ---
@app.post("/chat")
async def chat(req: ChatRequest, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    co = cohere.Client(os.getenv("COHERE_API_KEY"))
    try:
        response = co.generate(prompt=f"User: {req.message}", max_tokens=100)
        ai_msg = response.generations[0].text.strip()
        
        # Simple task detection
        if "task" in req.message.lower() or "todo" in req.message.lower():
            session.add(Task(user_id=current_user.id, title=req.message))
            
        session.add(ChatHistory(user_id=current_user.id, prompt=req.message, response=ai_msg))
        session.commit()
        return {"message": ai_msg, "chat_id": 0}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ... Signup/Login endpoints same as before ...