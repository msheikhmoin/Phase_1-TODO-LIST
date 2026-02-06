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

# CORS Fix: Allow all origins for Vercel frontend to communicate with Hugging Face backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
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

class ChatRequest(BaseModel):
    message: str

class ChatResponse(BaseModel):
    message: str
    tasks_created: List[Task] = []

@app.get("/")
def read_root():
    return {"message": "Backend is running!"}

@app.post("/auth/signup", response_model=User)
def signup(user_create: UserCreate, session: Session = Depends(get_session_dependency)):
    existing_user = session.exec(select(User).where(User.email == user_create.email)).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    hashed_password = get_password_hash(user_create.password)
    user = User(email=user_create.email, hashed_password=hashed_password)
    session.add(user)
    session.commit()
    session.refresh(user)
    return user

@app.post("/auth/login", response_model=Token)
def login(user_login: UserLogin, session: Session = Depends(get_session_dependency)):
    # Debug log
    print(f"--- Login Attempt: {user_login.email} ---")

    user = authenticate_user(session, user_login.email, user_login.password)
    if not user:
        print("--- Login Failed: Invalid Credentials ---")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    access_token = create_access_token(data={"sub": user.email}, expires_delta=timedelta(minutes=60))
    print("--- Login Successful! ---")
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/tasks", response_model=List[Task])
def read_tasks(current_user: User = Depends(get_current_user), session: Session = Depends(get_session_dependency)):
    return session.exec(select(Task).where(Task.user_id == current_user.id)).all()

@app.post("/chat", response_model=ChatResponse)
def chat(chat_request: ChatRequest, current_user: User = Depends(get_current_user), session: Session = Depends(get_session_dependency)):
    print(f"--- Chat Received: {chat_request.message} ---")
    try:
        # Use AI service, which now has robust fallback logic
        extracted_tasks_data = extract_tasks_from_text(chat_request.message)

        created_tasks = []
        if extracted_tasks_data:
            for task_data in extracted_tasks_data:
                # Handle deadline conversion if it's a string
                deadline = task_data.get("deadline")
                if deadline and isinstance(deadline, str):
                    from datetime import datetime
                    # Parse string deadline to datetime object
                    try:
                        # Try ISO format first
                        deadline = datetime.fromisoformat(deadline.replace('Z', '+00:00'))
                    except:
                        try:
                            # Try parsing as date string (YYYY-MM-DD)
                            from datetime import datetime
                            deadline = datetime.strptime(deadline, '%Y-%m-%d')
                        except:
                            # If all parsing fails, use current date
                            deadline = datetime.now()

                # Agar message mein task mil jaye, to usay Automatically database mein save karo (db.add(new_task))
                new_task = Task(
                    title=task_data.get("title", "New Task"),
                    description=task_data.get("description", ""),
                    category=task_data.get("category", "General"),
                    priority=task_data.get("priority", "Medium"),
                    deadline=deadline,
                    user_id=current_user.id
                )
                session.add(new_task)
                created_tasks.append(new_task)

            session.commit()
            for t in created_tasks:
                session.refresh(t)

        # VIP Conversational Responses: Replace hardcoded 'Task updated!' with friendly desi responses
        if created_tasks:
            task_names = [task.title for task in created_tasks]
            task_list_str = ", ".join(task_names[:2])  # Show first 2 tasks
            if len(task_names) > 2:
                task_list_str += f", aur {len(task_names)-2} aur tasks"

            # Extract deadline for the response message
            deadline_str = ""
            if created_tasks and created_tasks[0].deadline:
                from datetime import datetime
                deadline = created_tasks[0].deadline
                if isinstance(deadline, str):
                    # If deadline is a string, try to parse it
                    try:
                        parsed_date = datetime.fromisoformat(deadline.replace('Z', '+00:00'))
                        deadline_str = parsed_date.strftime('%Y-%m-%d')
                    except:
                        deadline_str = "specified date"
                elif hasattr(deadline, 'strftime'):
                    deadline_str = deadline.strftime('%Y-%m-%d')
                else:
                    deadline_str = "specified date"

                # VIP conversational response
                msg = f"Ji bhai, aapka task {task_list_str} {deadline_str} ke liye save kar diya hai! 😊"
            else:
                # VIP conversational response without date
                msg = f"Ji bhai, aapka task {task_list_str} successfully add kar diya hai! 😊"
        else:
            # Friendly response when no tasks are extracted
            msg = "Acha bataiye, main aapki kis tarah madad kar sakta hun? 🤔"

        print(f"--- Chat Success: {msg} ---")
        # Return JSON mein ek flag bhejo: tasks_created: true
        return ChatResponse(message=msg, tasks_created=created_tasks)

    except Exception as e:
        print(f"--- Chat Error: {str(e)} ---")
        session.rollback()
        # Return a safe response even if there are database errors
        return ChatResponse(message="Aapki baat samjhi gayi, lekin thoda technical issue hai. Phir se try kariye!", tasks_created=[])

@app.delete("/tasks/{task_id}")
def delete_task(task_id: str, current_user: User = Depends(get_current_user), session: Session = Depends(get_session_dependency)):
    # Convert the string task_id to UUID to match the database schema
    from uuid import UUID
    try:
        task_uuid = UUID(task_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid task ID format")

    # Find the task by ID and ensure it belongs to the current user
    task = session.exec(select(Task).where(Task.id == task_uuid, Task.user_id == current_user.id)).first()

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    # Delete the task
    session.delete(task)
    session.commit()

    return {"message": "Task deleted successfully"}

@app.on_event("startup")
def on_startup():
    from database import create_db_and_tables
    create_db_and_tables()

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)