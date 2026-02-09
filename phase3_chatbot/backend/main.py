from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from database import get_session_dependency as get_session
from sqlmodel import Session, select
from typing import List
import os
from datetime import timedelta
from pydantic import BaseModel
import cohere

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

@app.get("/tasks")
async def get_tasks(current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    return session.exec(select(Task).where(Task.user_id == current_user.id)).all()

@app.post("/chat")
async def chat(req: ChatRequest, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
    api_key = os.getenv("COHERE_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="API Key missing in Secrets")
    
    co = cohere.Client(api_key)
    try:
        # AI Prompt for Task detection
        response = co.generate(
            prompt=f"User wants to manage tasks. User message: {req.message}\nReply in friendly Hinglish/Urdu. If they mention a task, say 'Theek hai, save kar liya!'.", 
            max_tokens=100
        )
        ai_msg = response.generations[0].text.strip()
        
        # 🔥 Improved Task Detection
        task_keywords = ["task", "todo", "karna hai", "reminder", "yaad", "bazar", "buy"]
        if any(word in req.message.lower() for word in task_keywords):
            new_task = Task(user_id=current_user.id, title=req.message)
            session.add(new_task)
            
        new_chat = ChatHistory(user_id=current_user.id, prompt=req.message, response=ai_msg)
        session.add(new_chat)
        session.commit()
        
        # Frontend expects 'message' field
        return {"message": ai_msg, "status": "success"}
    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=str(e))

# ... Auth routes (Signup/Login) paste here from your existing main.py ...