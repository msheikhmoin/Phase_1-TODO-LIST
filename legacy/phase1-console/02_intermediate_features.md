# Spec: Intermediate Features - Phase I

## 1. Feature Overview
This specification details the requirements for intermediate-level features, including task priorities, tags, searching, filtering, and sorting. These enhancements provide users with greater control over task management.

## 2. Data Structure Changes
The `Task` model must be updated to include fields for title, priority and tags.

### Updated `Task` Model
- **id**: `int` - Unique identifier (auto-incrementing).
- **title**: `str` - The title of the task.
- **description**: `str` - The content of the task.
- **completed**: `bool` - The completion status of the task.
- **created_at**: `datetime` - Timestamp of when the task was created.
- **priority**: `Enum` - Priority level, must be one of 'High', 'Medium', or 'Low'.
- **tags**: `List[str]` - A list of string labels associated with the task.

### Example `tasks.json` structure:
```json
[
  {
    "id": 1,
    "title": "Q4 Report",
    "description": "Finalize the quarterly report for Q4.",
    "completed": false,
    "created_at": "2024-10-28T10:00:00Z",
    "priority": "High",
    "tags": ["work", "reporting"]
  },
  {
    "id": 2,
    "title": "Groceries",
    "description": "Buy groceries for the week.",
    "completed": true,
    "created_at": "2024-10-27T15:30:00Z",
    "priority": "Medium",
    "tags": ["home", "shopping"]
  }
]
```

## 3. UI/UX Behavior

### 3.1. Adding and Updating Tasks
- When adding a new task, the user should be prompted to set a priority and add optional tags.
  - **Priority Prompt**: "Set priority (High, Medium, Low) [default: Medium]:"
  - **Tags Prompt**: "Add tags (comma-separated, e.g., home, urgent):"
- The `update` command should allow modification of priority and tags.

### 3.2. Search and Filter
- A `search` command should be implemented to find tasks containing a specific keyword.
  - The search must be **case-insensitive**.
  - The search must cover both the `title` and `description` fields.
  - **Usage**: `search <keyword>`
- A `filter` command should be implemented to display tasks based on status or priority.
  - **Usage**: `filter --status <completed|pending>`
  - **Usage**: `filter --priority <High|Medium|Low>`

### 3.3. Sorting
- The `view` command should display tasks sorted by `created_at` in descending order (newest first) by **default**.
- Optional sorting parameters can be provided:
  - By `priority`: High -> Medium -> Low.
  - **Usage**: `view` (default sort)
  - **Usage**: `view --sort priority`

## 4. Acceptance Criteria
- All data structure changes are correctly implemented in `models.py`.
- New CLI commands (`search`, `filter`) and updated commands (`add`, `update`, `view`) behave as described.
- Input validation is in place for priority levels.
- The `tasks.json` file correctly stores and retrieves the new data fields.
- The application remains stable and handles edge cases gracefully (e.g., no matching search results).