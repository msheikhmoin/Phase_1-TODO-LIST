# Docker Configuration for VIP Todo AI Application

This directory contains Docker configurations for containerizing the Next.js frontend and FastAPI backend applications.

## Files Overview

- `Dockerfile.frontend`: Multi-stage build for the Next.js frontend application
- `Dockerfile.backend`: Multi-stage build for the FastAPI backend application  
- `docker-compose.yml`: Configuration for running both services with dependencies

## Features

### Frontend Dockerfile
- Multi-stage build process to optimize image size
- Health check endpoint at `/api/health` using TypeScript (route.ts)
- Non-root user for security
- Proper environment variable handling

### Backend Dockerfile
- Multi-stage build process to optimize image size
- Health check endpoint at `/health` using Pydantic models for compatibility (prevents 422 errors)
- Non-root user for security
- Proper environment variable handling for API keys and database connections
- Addresses the 422 Unprocessable Entity and API Key issues by ensuring proper environment configuration

## Environment Variables

For the backend, ensure the following environment variables are set:
- `DATABASE_URL`: PostgreSQL database connection string
- `JWT_SECRET`: Secret key for JWT token generation
- `COHERE_API_KEY`: API key for Cohere AI service

For the frontend, ensure:
- `NEXT_PUBLIC_API_URL`: Base URL for the backend API

## Usage

To build and run the services:

```bash
# From the project root directory
docker-compose -f docker/docker-compose.yml up --build
```

To build individual images:

```bash
# Build frontend
docker build -f docker/Dockerfile.frontend -t todo-frontend .

# Build backend
docker build -f docker/Dockerfile.backend -t todo-backend .
```