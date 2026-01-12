# Skill: Phase 2 - Configure Better Auth with JWT

## Purpose
Setup stateless JWT authentication from Next.js frontend.

## Actions
1. Configure Better Auth in frontend with JWT plugin enabled
2. Set shared BETTER_AUTH_SECRET in frontend/.env.local
3. Create src/lib/api.ts with centralized client that auto-attaches Authorization: Bearer <jwt>
4. Implement login and signup pages with Better Auth hooks
5. Setup middleware for protected routes

## Expected Output
"Better Auth configured: Frontend now issues and sends JWT tokens correctly."