import os
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select

from database import engine, create_db_and_tables
from models import User, Task
from auth import get_password_hash
from ai_service import get_ai_reply

# ---------------- APP ----------------

app = FastAPI(title="VIP Todo AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------- STARTUP ----------------

@app.on_event("startup")
def on_startup():
    create_db_and_tables()

    try:
        with Session(engine) as session:
            user = session.exec(
                select(User).where(User.email == "surkar2@gmail.com")
            ).first()

            if not user:
                new_user = User(
                    email="surkar2@gmail.com",
                    username="surkar2",
                    password_hash=get_password_hash("password1122"),
                )
                session.add(new_user)
                session.commit()
                print("✅ Default user created")

    except Exception as e:
        print("❌ Startup error:", e)

# ---------------- ROUTES ----------------

@app.get("/")
def root():
    return {"status": "Backend running"}

@app.post("/chat")
def chat(payload: dict):
    message = payload.get("message")
    if not message:
        raise HTTPException(status_code=400, detail="Message missing")

    reply = get_ai_reply(message)
    return {"reply": reply}

@app.post("/tasks")
def add_task(payload: dict):
    title = payload.get("title")
    if not title:
        raise HTTPException(status_code=400, detail="Title missing")

    with Session(engine) as session:
        task = Task(title=title)
        session.add(task)
        session.commit()
        session.refresh(task)

    return {"status": "task added", "task": task}

@app.get("/tasks")
def get_tasks():
    with Session(engine) as session:
        tasks = session.exec(select(Task)).all()
        return tasks
