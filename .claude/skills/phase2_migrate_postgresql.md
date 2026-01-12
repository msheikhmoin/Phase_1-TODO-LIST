# Skill: Phase 2 - Migrate to Neon PostgreSQL

## Purpose
Implement proper database schema with user-owned tasks using SQLModel.

## Actions
1. Update backend/models.py with SQLModel models:
   - User model (id, email, hashed_password)
   - Task model (id, user_id ForeignKey, title, description, completed, created_at, updated_at)
2. Implement full database.py with create_engine, SessionLocal, get_db dependency
3. Add Base.metadata.create_all(bind=engine) in main.py for dev

## Expected Output
"PostgreSQL schema implemented: Tasks now belong to specific users."