import os
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from passlib.context import CryptContext
from jose import jwt
from datetime import datetime, timedelta
import cohere

# --- CONFIGURATION ---
DATABASE_URL = os.getenv("DATABASE_URL")
SECRET_KEY = os.getenv("JWT_SECRET", "super-secret-key-123")
COHERE_API_KEY = os.getenv("COHERE_API_KEY")
ALGORITHM = "HS256"

# --- DATABASE CONNECTION FIX ---
# sslmode=require Neon ke liye zaroori hai
engine = create_engine(
    DATABASE_URL, 
    connect_args={"sslmode": "require"},
    pool_pre_ping=True
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
co = cohere.Client(COHERE_API_KEY)

# --- PASSWORD HASHING FIX ---
# Is mein 'argon2' add kiya hai taake aapke purane users login ho saken
pwd_context = CryptContext(schemes=["bcrypt", "argon2"], deprecated="auto")

# --- DATABASE MODELS ---
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
    deadline = Column(String)

# Tables create karna
Base.metadata.create_all(bind=engine)

# --- FASTAPI SETUP ---
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

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
    
    # Password verification with handling for UnknownHashError
    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    try:
        if not pwd_context.verify(data['password'], user.password_hash):
            raise HTTPException(status_code=401, detail="Invalid credentials")
    except Exception as e:
        print(f"Hashing Error: {e}")
        raise HTTPException(status_code=401, detail="Password format mismatch. Please use a new account.")

    token = create_access_token({"sub": user.email, "id": user.id})
    return {"access_token": token, "token_type": "bearer"}

@app.get("/tasks")
def get_tasks(db: Session = Depends(get_db)):
    return db.query(Task).all()

@app.post("/chat")
def chat(data: dict):
    user_msg = data.get("message", "")
    if not user_msg:
        return {"message": "Say something!"}
    try:
        response = co.generate(
            model='command',
            prompt=f"You are a helpful Todo List Assistant. User says: {user_msg}\nAssistant:",
            max_tokens=100
        )
        return {"message": response.generations[0].text.strip()}
    except Exception as e:
        return {"message": f"AI Error: {str(e)}"}