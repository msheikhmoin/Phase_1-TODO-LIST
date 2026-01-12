# Skill: Phase 2 - Setup FastAPI Backend

## Purpose
Create a clean, fresh FastAPI backend structure in the empty /backend folder for the multi-user web app.

## Actions (Do NOT execute now, only define)
1. Create backend/main.py with basic FastAPI app and health check endpoint
2. Create backend/database.py (placeholder for SQLModel engine and session)
3. Create backend/models.py (empty placeholder for Task and User models)
4. Create backend/dependencies.py (placeholder for future JWT auth)
5. Create backend/routers/__init__.py and backend/routers/tasks.py (empty task router)
6. Create backend/.env.example with:
   DATABASE_URL=postgresql://...
   BETTER_AUTH_SECRET=your_super_secret_key_here
7. Create requirements.txt in backend/ with:
   fastapi
   uvicorn
   sqlmodel
   psycopg2-binary
   python-jose[cryptography]
   passlib[bcrypt]
   python-multipart
8. Update backend/CLAUDE.md with these guidelines:

# Backend Guidelines - Phase 2

- FastAPI with proper structure
- SQLModel for ORM and models
- All routes under /api/
- JWT authentication required for task endpoints
- Tasks filtered by authenticated user_id
- Use dependencies for database session and current_user

## Expected Output Message (when executed later)
"Phase 2 FastAPI backend structure successfully created with proper folders and dependencies."