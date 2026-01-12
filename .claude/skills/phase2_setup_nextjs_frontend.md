# Skill: Phase 2 - Setup Next.js Frontend

## Purpose
Safely initialize a modern Next.js 16+ frontend in the empty /frontend folder for the full-stack todo web app.

## Actions (Do NOT execute now, only define)
1. cd frontend/
2. npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --yes
3. npm install better-auth
4. Update frontend/CLAUDE.md with these guidelines:

# Frontend Guidelines - Phase 2

- Next.js 16+ with App Router
- TypeScript mandatory
- Tailwind CSS for styling (no other CSS)
- Server Components by default
- Client Components only when necessary
- All API calls through src/lib/api.ts
- Better Auth for authentication and JWT tokens
- Automatically attach JWT to API requests
- Protected routes: unauthenticated users redirected to login

5. Create placeholder page src/app/page.tsx with content:
   "Phase 2: Next.js Todo Web App - Frontend Successfully Initialized!"

## Expected Output Message (when executed later)
"Phase 2 Next.js frontend successfully initialized with TypeScript, Tail