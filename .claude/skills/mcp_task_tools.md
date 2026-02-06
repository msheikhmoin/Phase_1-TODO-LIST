# MCP Task Tools Skill

## Purpose
Define Official MCP tools for task operations.

## Technical Specifications

### add_task Tool
**Description:** Creates a new task in the system
**Parameters:**
- `user_id` (string, required): Unique identifier for the user creating the task
- `title` (string, required): Title of the task
- `description` (string, optional): Detailed description of the task
- `priority` (string, optional): Priority level (low, medium, high)
- `due_date` (string, optional): Due date in ISO format

**Return Format:** `{"status": "created", "task_id": 5, "message": "Task created successfully"}`

**Implementation Details:**
- Uses SQLModel to create a new record in the tasks table
- Validates required parameters before insertion
- Returns the generated task ID upon successful creation

### list_tasks Tool
**Description:** Retrieves all tasks for a specific user
**Parameters:**
- `user_id` (string, required): Unique identifier for the user
- `status` (string, optional): Filter by task status (pending, completed, all)
- `priority` (string, optional): Filter by priority level

**Return Format:** `{"status": "success", "tasks": [{"id": 1, "title": "Sample Task", "status": "pending", ...}], "count": 1}`

**Implementation Details:**
- Uses SQLModel to query the tasks table
- Filters results based on provided parameters
- Returns an array of task objects with metadata

### complete_task Tool
**Description:** Marks a task as completed
**Parameters:**
- `user_id` (string, required): Unique identifier for the user
- `task_id` (integer, required): ID of the task to complete

**Return Format:** `{"status": "updated", "task_id": 5, "message": "Task marked as completed"}`

**Implementation Details:**
- Uses SQLModel to update the status field of the specified task
- Verifies user ownership before updating
- Returns confirmation of the update

### delete_task Tool
**Description:** Removes a task from the system
**Parameters:**
- `user_id` (string, required): Unique identifier for the user
- `task_id` (integer, required): ID of the task to delete

**Return Format:** `{"status": "deleted", "task_id": 5, "message": "Task deleted successfully"}`

**Implementation Details:**
- Uses SQLModel to delete the specified task record
- Verifies user ownership before deletion
- Returns confirmation of the deletion

### update_task Tool
**Description:** Updates properties of an existing task
**Parameters:**
- `user_id` (string, required): Unique identifier for the user
- `task_id` (integer, required): ID of the task to update
- `title` (string, optional): New title for the task
- `description` (string, optional): New description for the task
- `priority` (string, optional): New priority level
- `due_date` (string, optional): New due date
- `status` (string, optional): New status (pending, completed)

**Return Format:** `{"status": "updated", "task_id": 5, "message": "Task updated successfully"}`

**Implementation Details:**
- Uses SQLModel to update specified fields of the task
- Only updates provided fields, leaving others unchanged
- Verifies user ownership before updating
- Returns confirmation of the update

## Common Requirements
- All tools must require user_id to maintain statelessness
- All return formats are JSON objects
- All operations use SQLModel to perform CRUD operations on the existing Neon DB
- All tools implement proper error handling and validation