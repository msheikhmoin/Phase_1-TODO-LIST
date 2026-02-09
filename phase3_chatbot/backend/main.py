from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from database import get_session_dependency as get_session  # database.py se import
from sqlmodel import Session, select
from typing import List
import uvicorn
import os
from datetime import timedelta, datetime
from pydantic import BaseModel

# Phase 3 specific imports
from auth import get_password_hash, authenticate_user, create_access_token, get_current_user # auth.py se import
from models import User, ChatHistory # Humne jo p3 models banaye thay
# Note: Agar aapne tasks ka table bhi p3_tasks rakha hai to models se import karein

app = FastAPI(title="Phase 3 Todo AI Chatbot", version="1.0.0")

# CORS Setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Pydantic Schemas ---
class UserCreate(BaseModel):
    email: str
    username: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    message: str
    chat_id: int

# --- Routes ---

@app.get("/")
def read_root():
    return {"message": "Phase 3 Backend (p3_) is running!"}

@app.post("/auth/signup", response_model=dict)
def signup(user_create: UserCreate, session: Session = Depends(get_session)):
    existing_user = session.exec(select(User).where(User.email == user_create.email)).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pw = get_password_hash(user_create.password)
    user = User(
        email=user_create.email, 
        username=user_create.username, 
        password_hash=hashed_pw
    )
    session.add(user)
    session.commit()
    session.refresh(user)
    return {"message": "User created successfully", "user_id": user.id}

@app.post("/auth/login", response_model=Token)
def login(user_login: UserLogin, session: Session = Depends(get_session)):
    user = authenticate_user(session, user_login.email, user_login.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    access_token = create_access_token(data={"sub": user.email}, expires_delta=timedelta(minutes=60))
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/chat", response_model=ChatResponse)
async def chat(
    chat_request: ChatRequest, 
    current_user: User = Depends(get_current_user), 
    session: Session = Depends(get_session)
):
    print(f"--- Chat Received from {current_user.username}: {chat_request.message} ---")
    
    # Yahan hum Cohere AI ka response generate karenge
    import cohere
    co = cohere.Client(os.getenv("COHERE_API_KEY"))
    
    try:
        response = co.generate(
            model='command-xlarge-nightly',
            prompt=f"User says: {chat_request.message}. Reply in a friendly Desi/Urdu-English way as a task manager helper.",
            max_tokens=200
        )
        ai_msg = response.generations[0].text.strip()

        # Database (p3_chat_history) mein save karna
        new_chat = ChatHistory(
            user_id=current_user.id,
            prompt=chat_request.message,
            response=ai_msg
        )
        session.add(new_chat)
        session.commit()
        session.refresh(new_chat)

        return ChatResponse(message=ai_msg, chat_id=new_chat.id)

    except Exception as e:
        session.rollback()
        raise HTTPException(status_code=500, detail=f"AI Error: {str(e)}")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)