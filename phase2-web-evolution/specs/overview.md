# Phase 2: Full-Stack Web Application
**Project:** Evolution of Todo – Hackathon II

## Project Name
Hackathon II – Evolution of Todo (Phase 2: Full-Stack Web Application)

## Current Phase
Phase 2: Transform Phase 1 CLI app into a secure, multi-user, persistent full-stack web application.

## Objective
Build a modern web-based Todo application with:
- User authentication and isolation
- Persistent storage using Neon Serverless PostgreSQL
- Clean separation of frontend (Next.js) and backend (FastAPI)
- Strict Spec-Driven Development using Claude Code and Spec-Kit Plus

## Key Evolution from Phase 1
- In-memory → Persistent database storage
- Single-user CLI → Multi-user web app with authentication
- Console interface → Responsive web UI with Tailwind CSS
- No auth → Secure JWT-based authentication via Better Auth

## Core Features (Basic Level)
- Add, View, Update, Delete, Mark Complete tasks
- All operations scoped to authenticated user only

## Future Readiness
This phase is designed to seamlessly evolve into:
- Phase 3: AI-powered natural language chatbot
- Phase 4–5: Docker + Kubernetes + event-driven architecture

## Repository Structure
Monorepo with:
- /frontend → Next.js app
- /backend → FastAPI server
- /specs → All specifications (this folder)
- Multiple CLAUDE.md for layered guidance