# Feature Specification: Task CRUD Operations

## 1. Purpose
This specification defines the core Create, Read, Update, and Delete (CRUD) operations for tasks in the multi-user Todo application. The feature enables authenticated users to manage their personal tasks with full CRUD functionality while maintaining strict user isolation and security.

## 2. Scope (Phase II only)
This specification covers the implementation of task management operations for Phase II (Full-Stack Web Application). The scope includes:
- Backend API endpoints for task operations in FastAPI
- Database models and operations using SQLModel and Neon PostgreSQL
- Frontend components for task management in Next.js
- Authentication and authorization using Better Auth JWT tokens
- Validation and error handling for all operations

## 3. User Stories
- **As an authenticated user**, I want to create new tasks so that I can organize my work and responsibilities.
- **As an authenticated user**, I want to view my list of tasks so that I can see what needs to be done.
- **As an authenticated user**, I want to view details of a specific task so that I can understand its requirements.
- **As an authenticated user**, I want to update my tasks so that I can modify their details as needed.
- **As an authenticated user**, I want to delete tasks I no longer need so that I can keep my task list clean.
- **As an authenticated user**, I want to mark tasks as complete/incomplete so that I can track my progress.

## 4. Functional Requirements

### Create Task
- **Endpoint**: POST `/api/v1/tasks`
- **Authentication**: JWT token required in Authorization header
- **Request Body**:
  ```json
  {
    "title": "String, required, max 255 characters",
    "description": "String, optional, max 1000 characters",
    "priority": "String, one of ['low', 'medium', 'high', 'urgent'], default 'medium'",
    "due_date": "ISO 8601 datetime string, optional"
  }
  ```
- **Processing**:
  - Validate input data according to validation rules
  - Extract user_id from JWT token
  - Set created_by to authenticated user_id
  - Set initial status to "pending"
  - Set created_at and updated_at to current timestamp
  - Save task to database
- **Response**: 201 Created with created task data
- **Success Criteria**: Task is saved to database and returned to user

### View Task List
- **Endpoint**: GET `/api/v1/tasks`
- **Authentication**: JWT token required in Authorization header
- **Query Parameters**:
  - `status`: Filter by task status ('pending', 'in_progress', 'completed')
  - `priority`: Filter by priority ('low', 'medium', 'high', 'urgent')
  - `limit`: Number of tasks per page (default: 10, max: 50)
  - `offset`: Pagination offset (default: 0)
  - `sort`: Sort field and direction (e.g., 'created_at:desc')
- **Processing**:
  - Extract user_id from JWT token
  - Query database for tasks belonging to authenticated user
  - Apply filters based on query parameters
  - Apply pagination and sorting
- **Response**: 200 OK with paginated list of tasks
- **Success Criteria**: User receives their tasks with pagination metadata

### View Single Task
- **Endpoint**: GET `/api/v1/tasks/{id}`
- **Authentication**: JWT token required in Authorization header
- **Path Parameter**: `id` - Task ID (integer)
- **Processing**:
  - Extract user_id from JWT token
  - Verify task belongs to authenticated user
  - Return task details if found and owned by user
- **Response**: 200 OK with task data, or 404 if not found or unauthorized
- **Success Criteria**: User receives specific task if they own it

### Update Task
- **Endpoint**: PUT `/api/v1/tasks/{id}`
- **Authentication**: JWT token required in Authorization header
- **Path Parameter**: `id` - Task ID (integer)
- **Request Body** (all fields optional for partial updates):
  ```json
  {
    "title": "String, optional",
    "description": "String, optional",
    "status": "String, one of ['pending', 'in_progress', 'completed']",
    "priority": "String, one of ['low', 'medium', 'high', 'urgent']",
    "due_date": "ISO 8601 datetime string, optional",
    "completed_at": "ISO 8601 datetime string, optional"
  }
  ```
- **Processing**:
  - Extract user_id from JWT token
  - Verify task belongs to authenticated user
  - Validate input data according to validation rules
  - Update task fields as specified
  - Update updated_at timestamp
- **Response**: 200 OK with updated task data
- **Success Criteria**: Task is updated in database and returned to user

### Delete Task
- **Endpoint**: DELETE `/api/v1/tasks/{id}`
- **Authentication**: JWT token required in Authorization header
- **Path Parameter**: `id` - Task ID (integer)
- **Processing**:
  - Extract user_id from JWT token
  - Verify task belongs to authenticated user
  - Delete task from database
- **Response**: 200 OK with success message
- **Success Criteria**: Task is removed from database

### Mark Task Complete/Incomplete
- **Endpoint**: PATCH `/api/v1/tasks/{id}/complete`
- **Authentication**: JWT token required in Authorization header
- **Path Parameter**: `id` - Task ID (integer)
- **Request Body**:
  ```json
  {
    "completed": "Boolean, true to mark complete, false to mark incomplete"
  }
  ```
- **Processing**:
  - Extract user_id from JWT token
  - Verify task belongs to authenticated user
  - Toggle task completion status
  - Set completed_at timestamp if marking complete, clear if marking incomplete
  - Update status to 'completed' if completed, 'pending' if incomplete
  - Update updated_at timestamp
- **Response**: 200 OK with updated task data
- **Success Criteria**: Task completion status is toggled and saved

## 5. Validation Rules

### Title Length
- **Minimum Length**: 1 character
- **Maximum Length**: 255 characters
- **Required**: Yes for creation
- **Validation**: Title cannot be empty or whitespace only
- **Error Code**: `TITLE_TOO_SHORT` or `TITLE_TOO_LONG`

### Description Rules
- **Maximum Length**: 1000 characters
- **Required**: No (optional field)
- **Validation**: If provided, cannot exceed maximum length
- **Error Code**: `DESCRIPTION_TOO_LONG`
- **Special Characters**: Allow Unicode characters, prevent script injection

## 6. Ownership & Security Rules

### Task Must Belong to Authenticated User
- **Rule**: All task operations are scoped to the authenticated user
- **Implementation**:
  - User ID extracted from verified JWT token
  - All database queries filtered by user_id
  - Task creation sets created_by to authenticated user
  - Task retrieval queries include user_id filter
- **Access Control**:
  - Users can only access tasks where created_by matches their user_id
  - Attempting to access another user's task results in 404 Not Found
  - No user can modify another user's tasks

### Cross-User Access is Forbidden
- **Security Principle**: Complete isolation between users
- **Enforcement**:
  - Backend middleware verifies JWT and extracts user context
  - All database operations include user_id in WHERE clause
  - No direct access to other users' data is possible
  - API responses never expose other users' information
- **Error Handling**:
  - Unauthorized access attempts return 404 instead of 403
  - This prevents user enumeration attacks
  - No information leakage between users

## 7. Error Scenarios

### Authentication Failures
- **Invalid JWT**: 401 Unauthorized - Invalid or expired token
- **Missing Token**: 401 Unauthorized - No Authorization header provided
- **Malformed Token**: 401 Unauthorized - Token doesn't match expected format

### Authorization Failures
- **Access Denied**: 404 Not Found - User attempts to access non-owned task
- **Insufficient Permissions**: 404 Not Found - Prevents user enumeration

### Validation Errors
- **Invalid Input**: 422 Unprocessable Entity - Request data fails validation
- **Title Too Short**: 422 Unprocessable Entity - Title is empty or whitespace
- **Title Too Long**: 422 Unprocessable Entity - Title exceeds 255 characters
- **Invalid Priority**: 422 Unprocessable Entity - Priority not in allowed values
- **Invalid Status**: 422 Unprocessable Entity - Status not in allowed values

### Resource Errors
- **Task Not Found**: 404 Not Found - Task ID doesn't exist or belongs to another user
- **Database Error**: 500 Internal Server Error - Unexpected database failure
- **Server Error**: 500 Internal Server Error - Unexpected server error

### Rate Limiting
- **Too Many Requests**: 429 Too Many Requests - User exceeded rate limits
- **Rate Limit Headers**: Include retry-after and limit information

## 8. Non-Goals (what is NOT included in Phase II)

### Advanced Task Features
- Task assignments to other users (beyond self-assignment)
- Task dependencies or sub-tasks
- Recurring tasks or reminders
- File attachments or rich content
- Task comments or collaboration features
- Task categories or tags beyond priority

### User Management Extensions
- Admin privileges or super-user capabilities
- Organization or team-based task sharing
- Role-based access control beyond basic user isolation
- Bulk operations on tasks

### Performance Optimizations
- Real-time updates via WebSockets (REST API only in Phase II)
- Advanced caching strategies
- Database query optimization beyond basic indexing
- CDN integration for static assets

### Monitoring and Analytics
- Usage analytics or user behavior tracking
- Performance monitoring dashboards
- Advanced logging beyond basic request/response logging
- Error tracking services integration

### Security Enhancements
- Two-factor authentication
- Advanced audit trails
- Data encryption at application level
- Advanced threat detection

### Internationalization
- Multi-language support
- Localization features
- Regional date/time formats
- Cultural adaptation of UI elements