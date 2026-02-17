from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, DateTime, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional
import os
import cohere
from dotenv import load_dotenv
from health_check import HealthStatus, get_health_status

# 1. Environment variables load karna
load_dotenv()

# 2. Cohere Client Setup (Safe Initialization)
cohere_api_key = os.getenv("COHERE_API_KEY")
co = None
if cohere_api_key:
    try:
        co = cohere.Client(api_key=cohere_api_key)
    except Exception as e:
        print(f"Cohere Init Error: {e}")

# 3. Database setup
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@db:5432/todo_app")
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# 4. FastAPI instance
app = FastAPI(title="Todo Backend API - Phase 4 Final")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 5. Database Model
class TodoDB(Base):
    __tablename__ = "todos"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String, nullable=True)
    completed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

Base.metadata.create_all(bind=engine)

# 6. Pydantic Models
class TodoBase(BaseModel):
    title: str
    description: Optional[str] = None
    completed: bool = False

class TodoCreate(TodoBase):
    pass

class Todo(TodoBase):
    id: int
    created_at: datetime
    updated_at: datetime
    class Config:
        from_attributes = True

# 7. Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- ROUTES ---

@app.get("/")
def read_root():
    return {"message": "Todo Backend API is running on Port 8000"}

@app.get("/todos/", response_model=List[Todo])
def read_todos(db: Session = Depends(get_db)):
    return db.query(TodoDB).all()

@app.post("/todos/", response_model=Todo)
def create_todo(todo: TodoCreate, db: Session = Depends(get_db)):
    db_todo = TodoDB(**todo.dict())
    db.add(db_todo)
    db.commit()
    db.refresh(db_todo)
    return db_todo

@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: int, db: Session = Depends(get_db)):
    todo = db.query(TodoDB).filter(TodoDB.id == todo_id).first()
    if not todo:
        raise HTTPException(status_code=404, detail="Todo not found")
    db.delete(todo)
    db.commit()
    return {"message": "Deleted"}

# --- CHATBOT ENDPOINT (SUPER STABLE VERSION) ---

@app.post("/chat/")
async def chat_with_bot(request_data: dict):
    user_message = request_data.get("message", "Hi")
    
    if not cohere_api_key or not co:
        return {"response": "Backend Error: COHERE_API_KEY is missing in .env or Kubernetes Secret."}

    try:
        # METHOD A: Sabse naya SDK (v5+)
        response = co.chat(message=user_message, model="command-r-plus")
        return {"response": response.text}
    
    except Exception as e1:
        try:
            # METHOD B: Purana SDK style (Positional argument)
            response = co.chat(user_message)
            return {"response": response.text}
        
        except Exception as e2:
            try:
                # METHOD C: Generate style (kuch versions mein generate chalta hai)
                response = co.generate(prompt=user_message, max_tokens=100)
                return {"response": response.generations[0].text}
            
            except Exception as e3:
                # METHOD D: Agar sab fail ho jaye lekin API connect ho rahi ho
                return {"response": f"AI Error: Humne 3 tareeke try kiye magar Cohere connect nahi ho raha. Detail: {str(e1)}"}

@app.get("/health", response_model=HealthStatus)
def health_check(db: Session = Depends(get_db)):
    return get_health_status()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)