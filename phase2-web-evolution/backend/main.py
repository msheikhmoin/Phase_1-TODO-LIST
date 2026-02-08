from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from db import init_db
import os
from dotenv import load_dotenv
from auth_utils import get_current_user
from fastapi import Depends

# Load environment variables
load_dotenv()

app = FastAPI(title="Todo API", version="1.0.0")

# CORS middleware to allow requests from localhost:3000 (frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow requests from frontend
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allow all headers
    # Additional security settings
    max_age=3600,  # Cache preflight requests for 1 hour
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
    init_db()
    print("Database initialized successfully")

@app.get("/")
def read_root():
    """Root endpoint for health check"""
    return {"message": "Todo API is running", "status": "healthy"}

# Placeholder for protected route
@app.get("/protected")
def protected_route(current_user: dict = Depends(get_current_user)):
    """Protected route that requires authentication"""
    return {
        "message": f"Hello {current_user['username']}, this is a protected route!",
        "user_id": current_user["user_id"],
        "authenticated": True
    }

# Include other routes here when created
# from . import routes
# app.include_router(routes.router, prefix="/api/v1")

def main():
    """Main function for development"""
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)


if __name__ == "__main__":
    main()
