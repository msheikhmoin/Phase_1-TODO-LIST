from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from db import init_db
import os
from dotenv import load_dotenv
from auth_utils import get_current_user

# Load environment variables
load_dotenv()

app = FastAPI(title="Todo API", version="1.0.0")

# ✅ UPDATED CORS: Is se Vercel aur Local dono kaam karenge
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for production
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
    max_age=3600,
)

# Include authentication routes
from routes.auth import router as auth_router
app.include_router(auth_router, prefix="/api/v1", tags=["auth"])

# Include task routes
from routes.tasks import router as tasks_router
app.include_router(tasks_router, prefix="/api/v1", tags=["tasks"])

@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    try:
        init_db()
        print("Database initialized successfully")
    except Exception as e:
        print(f"Database init error: {e}")

@app.get("/")
def read_root():
    """Root endpoint for health check - Hugging Face uses this to check if app is alive"""
    return {"message": "Todo API is running on Hugging Face", "status": "healthy"}

@app.get("/protected")
def protected_route(current_user: dict = Depends(get_current_user)):
    """Protected route that requires authentication"""
    return {
        "message": f"Hello {current_user['username']}, this is a protected route!",
        "user_id": current_user["user_id"],
        "authenticated": True
    }

if __name__ == "__main__":
    import uvicorn
    # Hugging Face normally uses port 7860
    port = int(os.environ.get("PORT", 7860))
    uvicorn.run(app, host="0.0.0.0", port=port)