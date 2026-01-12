# Skill: Phase 2 - JWT Authentication in FastAPI

## Purpose
Secure backend API with JWT verification and user-specific data access.

## Actions
1. Implement JWT verification in dependencies.py using BETTER_AUTH_SECRET
2. Create get_current_user dependency that returns user_id from verified token
3. Create task router with full CRUD endpoints requiring authentication
4. All queries filtered by current_user.id
5. Proper HTTP exceptions for 401/403

## Expected Output
"Backend fully secured: Only authenticated users can access/modify their own tasks."