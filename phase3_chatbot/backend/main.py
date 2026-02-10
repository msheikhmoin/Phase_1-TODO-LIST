import os
import cohere
from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import Session, select

from database import create_db_and_tables, get_session, engine
from models import User, Task, ChatHistory
from auth import (
verify_password,
get_password_hash,
create_access_token,
get_current_user
)

from pydantic import BaseModel

app = FastAPI()

# CORS

app.add_middleware(
CORSMiddleware,
allow_origins=["*"],
allow_credentials=True,
allow_methods=["*"],
allow_headers=["*"],
)

# -------- STARTUP --------

@app.on_event("startup")
def on_startup():
create_db_and_tables()

```
from sqlmodel import Session
try:
    with Session(engine) as session:
        user = session.exec(
            select(User).where(User.email == "surkar2@gmail.com")
        ).first()

        if not user:
            new_user = User(
                email="surkar2@gmail.com",
                username="surkar2",
                password_hash=get_password_hash("password1122")
            )
            session.add(new_user)
            session.commit()
            print("Default user created")
except Exception as e:
    print("Startup error:", e)
```

# -------- LOGIN --------

class LoginData(BaseModel):
email: str
password: str

@app.post("/login")
def login(data: LoginData, session: Session = Depends(get_session)):
user = session.exec(select(User).where(User.email == data.email)).first()

```
if not user or not verify_password(data.password, user.password_hash):
    raise HTTPException(status_code=401, detail="Invalid credentials")

token = create_access_token({"sub": user.id})
return {"access_token": token, "token_type": "bearer"}
```

# -------- TASKS --------

@app.get("/tasks")
def get_tasks(current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
tasks = session.exec(select(Task).where(Task.user_id == current_user.id)).all()
return tasks

# -------- CHAT --------

class ChatRequest(BaseModel):
message: str

@app.post("/chat")
def chat(req: ChatRequest, current_user: User = Depends(get_current_user), session: Session = Depends(get_session)):
try:
co = cohere.Client(os.getenv("COHERE_API_KEY"))

```
    response = co.chat(
        message=req.message,
        model="command-r",
        temperature=0.5
    )

    ai_msg = response.text.strip()

    # auto task create
    if any(word in req.message.lower() for word in ["kal", "todo", "task", "bazar", "buy", "lana"]):
        task = Task(
            user_id=current_user.id,
            title=req.message,
            category="General",
            priority="Medium",
            completed=False
        )
        session.add(task)

    session.add(ChatHistory(user_id=current_user.id, prompt=req.message, response=ai_msg))
    session.commit()

    return {"message": ai_msg}

except Exception as e:
    session.rollback()
    raise HTTPException(status_code=500, detail=str(e))
```
