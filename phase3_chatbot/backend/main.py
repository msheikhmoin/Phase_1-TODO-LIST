from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from database import get_session_dependency
from sqlmodel import Session, select
from typing import Annotated, List
import uvicorn
from auth import get_password_hash, authenticate_user, create_access_token, get_current_user
from models import User, Task
from datetime import timedelta
from pydantic import BaseModel
from ai_service import extract_tasks_from_text


app = FastAPI(title="Todo AI Chatbot Backend", version="0.1.0")


# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class UserCreate(BaseModel):
    email: str
    password: str


class UserLogin(BaseModel):
    email: str
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class TaskCreate(BaseModel):
    title: str
    description: str = None


class TaskUpdate(BaseModel):
    title: str = None
    description: str = None
    completed: bool = None


@app.get("/")
def read_root():
    return {"message": "Welcome to the Todo AI Chatbot Backend!"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.post("/auth/signup", response_model=User)
def signup(user_create: UserCreate, session: Session = Depends(get_session_dependency)):
    # Check if user already exists
    existing_user = session.exec(select(User).where(User.email == user_create.email)).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create new user
    hashed_password = get_password_hash(user_create.password)
    user = User(email=user_create.email, hashed_password=hashed_password)
    session.add(user)
    session.commit()
    session.refresh(user)
    return user


@app.post("/auth/login", response_model=Token)
def login(user_login: UserLogin, session: Session = Depends(get_session_dependency)):
    user = authenticate_user(session, user_login.email, user_login.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token_expires = timedelta(minutes=30)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )

    # Return token in OAuth2 standard format
    return {"access_token": access_token, "token_type": "bearer"}


# Task endpoints
@app.post("/tasks", response_model=Task)
def create_task(task_create: TaskCreate, current_user: User = Depends(get_current_user), session: Session = Depends(get_session_dependency)):
    """Create a new task for the current user"""
    task = Task(
        title=task_create.title,
        description=task_create.description,
        user_id=current_user.id
    )
    session.add(task)
    session.commit()
    session.refresh(task)
    return task


@app.get("/tasks", response_model=List[Task])
def read_tasks(current_user: User = Depends(get_current_user), session: Session = Depends(get_session_dependency)):
    """Get all tasks for the current user"""
    tasks = session.exec(select(Task).where(Task.user_id == current_user.id)).all()
    return tasks


@app.get("/tasks/{task_id}", response_model=Task)
def read_task(task_id: str, current_user: User = Depends(get_current_user), session: Session = Depends(get_session_dependency)):
    """Get a specific task by ID for the current user"""
    task = session.exec(select(Task).where(Task.id == task_id).where(Task.user_id == current_user.id)).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@app.put("/tasks/{task_id}", response_model=Task)
def update_task(task_id: str, task_update: TaskUpdate, current_user: User = Depends(get_current_user), session: Session = Depends(get_session_dependency)):
    """Update a specific task by ID for the current user"""
    task = session.exec(select(Task).where(Task.id == task_id).where(Task.user_id == current_user.id)).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Update task fields if provided
    if task_update.title is not None:
        task.title = task_update.title
    if task_update.description is not None:
        task.description = task_update.description
    if task_update.completed is not None:
        task.completed = task_update.completed

    session.add(task)
    session.commit()
    session.refresh(task)
    return task


@app.delete("/tasks/{task_id}")
def delete_task(task_id: str, current_user: User = Depends(get_current_user), session: Session = Depends(get_session_dependency)):
    """Delete a specific task by ID for the current user"""
    task = session.exec(select(Task).where(Task.id == task_id).where(Task.user_id == current_user.id)).first()
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    session.delete(task)
    session.commit()
    return {"message": "Task deleted successfully"}


class ChatRequest(BaseModel):
    message: str


class ChatResponse(BaseModel):
    message: str
    tasks_created: List[Task] = []


@app.post("/chat", response_model=ChatResponse)
def chat(chat_request: ChatRequest, current_user: User = Depends(get_current_user), session: Session = Depends(get_session_dependency)):
    """Process user message, extract tasks using AI, and save them to the database"""
    user_message = chat_request.message

    # Extract tasks from the user's message using AI
    extracted_tasks = extract_tasks_from_text(user_message)

    created_tasks = []

    # Save each extracted task to the database for the current user
    for task_data in extracted_tasks:
        task = Task(
            title=task_data.get("title", ""),
            description=task_data.get("description", ""),
            category=task_data.get("category", "General"),
            priority=task_data.get("priority", "Medium"),
            user_id=current_user.id
        )
        session.add(task)
        session.commit()
        session.refresh(task)
        created_tasks.append(task)

    return ChatResponse(
        message=f"Processed your message. Created {len(created_tasks)} tasks.",
        tasks_created=created_tasks
    )


@app.on_event("startup")
def on_startup():
    from database import create_db_and_tables
    create_db_and_tables()


# Dependency injection example
DBSessionDep = Annotated[Session, Depends(get_session_dependency)]


if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)