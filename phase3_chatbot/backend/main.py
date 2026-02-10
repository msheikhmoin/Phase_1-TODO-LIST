import os
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Date, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from passlib.context import CryptContext
from jose import JWTError, jwt
from datetime import datetime, timedelta
import cohere

# --- CONFIGURATION ---
# Hugging Face Secrets se values uthayega
DATABASE_URL = os.getenv("DATABASE_URL")
SECRET_KEY = os.getenv("JWT_SECRET", "super-secret-key-123")
COHERE_API_KEY = os.getenv("COHERE_API_KEY")
ALGORITHM = "HS256"

# Database & AI Clients
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
co = cohere.Client(COHERE_API_KEY)

# Password Hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# --- DATABASE MODELS (Matching your Neon Tables) ---
class User(Base):
    __tablename__ = "p3_users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)

class Task(Base):
    __tablename__ = "p3_tasks"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("p3_users.id"))
    title = Column(String)
    description = Column(String)
    deadline = Column(String) # String format for simplicity

# Tables create karna (Agar pehle se nahi hain)
Base.metadata.create_all(bind=engine)

# --- FASTAPI SETUP ---
app = FastAPI()

# CORS allow karna taake Frontend (Vercel) baat kar sakay
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database Session Helper
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# JWT Token Generator
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=7)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

# --- ENDPOINTS ---

@app.get("/")
def home():
    return {"status": "VIP Todo AI Backend is Running!"}

@app.post("/signup")
def signup(user_data: dict, db: Session = Depends(get_db)):
    # Check if user already exists
    existing = db.query(User).filter(User.email == user_data['email']).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    new_user = User(
        username=user_data['username'],
        email=user_data['email'],
        password_hash=pwd_context.hash(user_data['password'])
    )
    db.add(new_user)
    db.commit()
    return {"message": "User created successfully"}

@app.post("/login")
def login(data: dict, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == data['email']).first()
    if not user or not pwd_context.verify(data['password'], user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token({"sub": user.email, "id": user.id})
    return {"access_token": token, "token_type": "bearer"}

@app.get("/tasks")
def get_tasks(db: Session = Depends(get_db)):
    # Saare tasks fetch karne ke liye (Abhi ke liye filter nahi lagaya)
    tasks = db.query(Task).all()
    return tasks

@app.post("/chat")
def chat(data: dict):
    user_msg = data.get("message", "")
    if not user_msg:
        return {"message": "Say something!"}
    
    try:
        # AI (Cohere) se response lena
        response = co.generate(
            model='command',
            prompt=f"You are a helpful Todo List Assistant. User says: {user_msg}\nAssistant:",
            max_tokens=100
        )
        ai_reply = response.generations[0].text.strip()
        return {"message": ai_reply}
    except Exception as e:
        return {"message": f"AI Error: {str(e)}"}