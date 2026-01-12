# REST API Endpoints Specification

## Overview
This document defines the complete REST API for the Todo application with JWT authentication, Better Auth integration, and comprehensive endpoint specifications. All endpoints follow RESTful principles with proper HTTP status codes and response formats.

## Authentication Architecture

### JWT Verification Flow
1. **Token Generation**: Better Auth generates JWT with shared secret
2. **Token Validation**: Middleware validates JWT signature using shared secret
3. **Token Refresh**: Automatic refresh for tokens within 15 minutes of expiration
4. **Token Expiration**: 24-hour token lifetime with refresh token validity of 7 days

### Shared Secret Configuration
- **Secret Storage**: Environment variable `BETTER_AUTH_SECRET`
- **Algorithm**: RS256 (RSA Signature with SHA-256)
- **Key Rotation**: Monthly automatic rotation with dual-key support
- **Validation**: Asymmetric key validation to prevent token forgery

### Authentication Middleware
```typescript
// Middleware implementation details
interface AuthMiddleware {
  validateToken(token: string): Promise<AuthResult>;
  extractUser(token: string): Promise<User>;
  refreshIfNecessary(token: string): Promise<string | null>;
}
```

## API Base Configuration
- **Base URL**: `/api/v1`
- **Content-Type**: `application/json`
- **Authentication**: Bearer token in Authorization header
- **Rate Limiting**: 100 requests/minute per IP with user override
- **CORS**: Configured for frontend domain only

## Core Endpoints

### 1. User Authentication Endpoints

#### POST `/api/v1/auth/login`
**Description**: Authenticate user and return JWT token
**Authentication**: None (public endpoint)
**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "user_password"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "username": "username",
      "full_name": "John Doe"
    },
    "tokens": {
      "access_token": "jwt_access_token",
      "refresh_token": "jwt_refresh_token",
      "expires_in": 86400
    }
  }
}
```

**Error Responses**:
- `400 Bad Request`: Invalid email/password format
- `401 Unauthorized`: Invalid credentials
- `429 Too Many Requests`: Rate limit exceeded

#### POST `/api/v1/auth/register`
**Description**: Register new user account
**Authentication**: None (public endpoint)
**Request Body**:
```json
{
  "email": "user@example.com",
  "username": "username",
  "password": "secure_password",
  "full_name": "John Doe"
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "email": "user@example.com",
      "username": "username",
      "full_name": "John Doe",
      "created_at": "2026-01-08T10:00:00Z"
    },
    "tokens": {
      "access_token": "jwt_access_token",
      "refresh_token": "jwt_refresh_token",
      "expires_in": 86400
    }
  }
}
```

**Error Responses**:
- `400 Bad Request`: Invalid input format
- `409 Conflict`: Email or username already exists
- `422 Unprocessable Entity`: Validation errors

#### POST `/api/v1/auth/refresh`
**Description**: Refresh expired access token
**Authentication**: Refresh token in request body
**Request Body**:
```json
{
  "refresh_token": "jwt_refresh_token"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "access_token": "new_jwt_access_token",
    "expires_in": 86400
  }
}
```

**Error Responses**:
- `400 Bad Request`: Invalid refresh token
- `401 Unauthorized`: Refresh token expired or invalid

### 2. Task Management Endpoints

#### GET `/api/v1/tasks`
**Description**: Retrieve user's tasks with filtering and pagination
**Authentication**: Bearer token required
**Query Parameters**:
- `status`: Filter by task status (pending, in_progress, completed)
- `priority`: Filter by priority (low, medium, high, urgent)
- `assigned_to`: Filter by assigned user ID
- `limit`: Number of tasks per page (default: 10, max: 50)
- `offset`: Offset for pagination (default: 0)
- `sort`: Sort field and direction (e.g., "created_at:desc")

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "id": 1,
        "title": "Complete project",
        "description": "Finish the todo app project",
        "status": "pending",
        "priority": "high",
        "due_date": "2026-01-15T10:00:00Z",
        "created_by": 1,
        "assigned_to": 1,
        "created_at": "2026-01-08T09:00:00Z",
        "updated_at": "2026-01-08T09:00:00Z",
        "completed_at": null
      }
    ],
    "pagination": {
      "total": 100,
      "limit": 10,
      "offset": 0,
      "has_more": true
    }
  }
}
```

#### POST `/api/v1/tasks`
**Description**: Create a new task
**Authentication**: Bearer token required
**Request Body**:
```json
{
  "title": "New task title",
  "description": "Task description",
  "priority": "medium",
  "due_date": "2026-01-15T10:00:00Z"
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "data": {
    "task": {
      "id": 1,
      "title": "New task title",
      "description": "Task description",
      "status": "pending",
      "priority": "medium",
      "due_date": "2026-01-15T10:00:00Z",
      "created_by": 1,
      "assigned_to": 1,
      "created_at": "2026-01-08T10:00:00Z",
      "updated_at": "2026-01-08T10:00:00Z",
      "completed_at": null
    }
  }
}
```

#### GET `/api/v1/tasks/{id}`
**Description**: Retrieve a specific task by ID
**Authentication**: Bearer token required
**Path Parameter**: `id` - Task ID
**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "task": {
      "id": 1,
      "title": "Task title",
      "description": "Task description",
      "status": "pending",
      "priority": "medium",
      "due_date": "2026-01-15T10:00:00Z",
      "created_by": 1,
      "assigned_to": 1,
      "created_at": "2026-01-08T10:00:00Z",
      "updated_at": "2026-01-08T10:00:00Z",
      "completed_at": null
    }
  }
}
```

**Error Responses**:
- `404 Not Found`: Task not found or not owned by user

#### PUT `/api/v1/tasks/{id}`
**Description**: Update a specific task by ID
**Authentication**: Bearer token required
**Path Parameter**: `id` - Task ID
**Request Body** (partial update allowed):
```json
{
  "title": "Updated task title",
  "status": "in_progress",
  "priority": "high"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "task": {
      "id": 1,
      "title": "Updated task title",
      "description": "Task description",
      "status": "in_progress",
      "priority": "high",
      "due_date": "2026-01-15T10:00:00Z",
      "created_by": 1,
      "assigned_to": 1,
      "created_at": "2026-01-08T10:00:00Z",
      "updated_at": "2026-01-08T11:00:00Z",
      "completed_at": null
    }
  }
}
```

#### DELETE `/api/v1/tasks/{id}`
**Description**: Delete a specific task by ID
**Authentication**: Bearer token required
**Path Parameter**: `id` - Task ID
**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

#### PATCH `/api/v1/tasks/{id}/complete`
**Description**: Mark a task as completed
**Authentication**: Bearer token required
**Path Parameter**: `id` - Task ID
**Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "task": {
      "id": 1,
      "title": "Task title",
      "description": "Task description",
      "status": "completed",
      "priority": "medium",
      "due_date": "2026-01-15T10:00:00Z",
      "created_by": 1,
      "assigned_to": 1,
      "created_at": "2026-01-08T10:00:00Z",
      "updated_at": "2026-01-08T12:00:00Z",
      "completed_at": "2026-01-08T12:00:00Z"
    }
  }
}
```

## Error Response Format
All error responses follow this standard format:
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {
      "field": "specific field causing error",
      "value": "problematic value"
    }
  }
}
```

## HTTP Status Codes
- `200 OK`: Request successful
- `201 Created`: Resource created successfully
- `400 Bad Request`: Invalid request format
- `401 Unauthorized`: Authentication required or failed
- `403 Forbidden`: Insufficient permissions
- `404 Not Found`: Resource not found
- `409 Conflict`: Resource conflict (e.g., duplicate email)
- `422 Unprocessable Entity`: Validation errors
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

## Request/Response Validation
- All requests validated against JSON Schema
- Response schema validation for consistency
- Input sanitization to prevent injection attacks
- Output encoding to prevent XSS

## Rate Limiting
- Per-user limits: 1000 requests/hour
- Per-IP limits: 100 requests/minute
- Burst allowance: 2x rate for short periods
- Rate limit headers included in all responses

## Security Headers
- Content Security Policy (CSP)
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- Strict-Transport-Security: max-age=31536000