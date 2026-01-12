from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel
from typing import List, Optional
from sqlmodel import Session, select, and_
from sqlalchemy import func
from models import Task, User, TaskStatus, TaskPriority
from auth_utils import get_current_user
from db import get_session
from datetime import datetime

router = APIRouter(prefix="/tasks", tags=["tasks"])

# Request models
class CreateTaskRequest(BaseModel):
    title: str
    description: Optional[str] = None
    priority: str = "medium"
    due_date: Optional[str] = None

class UpdateTaskRequest(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    due_date: Optional[str] = None

# Response models
class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    status: str
    priority: str
    due_date: Optional[str] = None
    created_by: int
    assigned_to: Optional[int] = None
    created_at: str
    updated_at: str
    completed_at: Optional[str] = None

class TaskListResponse(BaseModel):
    tasks: List[TaskResponse]
    pagination: dict

@router.get("/", response_model=TaskListResponse)
async def get_tasks(
    current_user: dict = Depends(get_current_user),
    status: Optional[str] = Query(None, description="Filter by status"),
    priority: Optional[str] = Query(None, description="Filter by priority"),
    limit: int = Query(10, ge=1, le=50, description="Number of tasks per page"),
    offset: int = Query(0, ge=0, description="Offset for pagination"),
    session: Session = Depends(get_session)
):
    """
    Retrieve user's tasks with filtering and pagination
    """
    try:
        # Build query - removing user isolation to show all tasks
        user_id = current_user["user_id"]
        query = select(Task)

        # Apply filters
        conditions = []
        if status:
            conditions.append(Task.status == status)
        if priority:
            conditions.append(Task.priority == priority)

        if conditions:
            query = query.where(and_(*conditions))

        # Apply pagination
        query = query.offset(offset).limit(limit).order_by(Task.created_at.desc())

        tasks = session.exec(query).all()

        # Debug: Log the current user ID and task count
        print(f"DEBUG: Current user_id: {user_id}, Found {len(tasks)} tasks")

        # Count total for pagination - using a scalar count query for efficiency
        count_query = select(func.count(Task.id))
        if conditions:
            count_query = count_query.where(and_(*conditions))
        total = session.exec(count_query).one()

        # Convert to response format
        task_responses = []
        for task in tasks:
            print(f"DEBUG: Task ID {task.id} created by {task.created_by}")  # Debug log
            task_responses.append(TaskResponse(
                id=task.id,
                title=task.title,
                description=task.description,
                status=task.status,
                priority=task.priority,
                due_date=task.due_date.isoformat() if task.due_date else None,
                created_by=task.created_by,
                assigned_to=task.assigned_to,
                created_at=task.created_at.isoformat(),
                updated_at=task.updated_at.isoformat(),
                completed_at=task.completed_at.isoformat() if task.completed_at else None
            ))

        return TaskListResponse(
            tasks=task_responses,
            pagination={
                "total": total,
                "limit": limit,
                "offset": offset,
                "has_more": offset + limit < total
            }
        )
    except Exception as e:
        print(f"Error in get_tasks: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to retrieve tasks: {str(e)}")

@router.post("/", response_model=TaskResponse)
async def create_task(
    task_request: CreateTaskRequest,
    current_user: dict = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Create a new task for the authenticated user
    """
    try:
        # Validate priority
        if task_request.priority not in ["low", "medium", "high", "urgent"]:
            raise HTTPException(status_code=400, detail="Invalid priority")

        # Create task
        new_task = Task(
            title=task_request.title,
            description=task_request.description,
            status="pending",  # Default status
            priority=task_request.priority,
            due_date=datetime.fromisoformat(task_request.due_date) if task_request.due_date else None,
            created_by=current_user["user_id"],  # User isolation: assign to current user
            assigned_to=current_user["user_id"],  # Assign to current user by default
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow()
        )

        session.add(new_task)
        session.commit()
        session.refresh(new_task)

        return TaskResponse(
            id=new_task.id,
            title=new_task.title,
            description=new_task.description,
            status=new_task.status,
            priority=new_task.priority,
            due_date=new_task.due_date.isoformat() if new_task.due_date else None,
            created_by=new_task.created_by,
            assigned_to=new_task.assigned_to,
            created_at=new_task.created_at.isoformat(),
            updated_at=new_task.updated_at.isoformat(),
            completed_at=new_task.completed_at.isoformat() if new_task.completed_at else None
        )
    except Exception as e:
        print(f"Error in create_task: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Task creation failed: {str(e)}")

@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: int,
    current_user: dict = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Retrieve a specific task by ID
    """
    task = session.get(Task, task_id)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")


    return TaskResponse(
        id=task.id,
        title=task.title,
        description=task.description,
        status=task.status,
        priority=task.priority,
        due_date=task.due_date.isoformat() if task.due_date else None,
        created_by=task.created_by,
        assigned_to=task.assigned_to,
        created_at=task.created_at.isoformat(),
        updated_at=task.updated_at.isoformat(),
        completed_at=task.completed_at.isoformat() if task.completed_at else None
    )

@router.put("/{task_id}", response_model=TaskResponse)
async def update_task(
    task_id: int,
    task_request: UpdateTaskRequest,
    current_user: dict = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Update a specific task by ID
    """
    task = session.get(Task, task_id)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")


    # Update fields if provided
    if task_request.title is not None:
        task.title = task_request.title
    if task_request.description is not None:
        task.description = task_request.description
    if task_request.status is not None:
        # Validate status
        if task_request.status not in ["pending", "in_progress", "completed"]:
            raise HTTPException(status_code=400, detail="Invalid status")
        task.status = task_request.status
        # Set completed_at if status is completed
        if task_request.status == "completed" and not task.completed_at:
            task.completed_at = datetime.utcnow()
    if task_request.priority is not None:
        # Validate priority
        if task_request.priority not in ["low", "medium", "high", "urgent"]:
            raise HTTPException(status_code=400, detail="Invalid priority")
        task.priority = task_request.priority
    if task_request.due_date is not None:
        task.due_date = datetime.fromisoformat(task_request.due_date) if task_request.due_date else None

    task.updated_at = datetime.utcnow()
    session.add(task)
    session.commit()
    session.refresh(task)

    return TaskResponse(
        id=task.id,
        title=task.title,
        description=task.description,
        status=task.status,
        priority=task.priority,
        due_date=task.due_date.isoformat() if task.due_date else None,
        created_by=task.created_by,
        assigned_to=task.assigned_to,
        created_at=task.created_at.isoformat(),
        updated_at=task.updated_at.isoformat(),
        completed_at=task.completed_at.isoformat() if task.completed_at else None
    )

@router.delete("/{task_id}")
async def delete_task(
    task_id: int,
    current_user: dict = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Delete a specific task by ID
    """
    task = session.get(Task, task_id)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")


    session.delete(task)
    session.commit()

    return {"success": True, "message": "Task deleted successfully"}

@router.patch("/{task_id}/complete", response_model=TaskResponse)
async def complete_task(
    task_id: int,
    current_user: dict = Depends(get_current_user),
    session: Session = Depends(get_session)
):
    """
    Mark a task as completed
    """
    task = session.get(Task, task_id)

    if not task:
        raise HTTPException(status_code=404, detail="Task not found")


    task.status = "completed"
    task.completed_at = datetime.utcnow()
    task.updated_at = datetime.utcnow()

    session.add(task)
    session.commit()
    session.refresh(task)

    return TaskResponse(
        id=task.id,
        title=task.title,
        description=task.description,
        status=task.status,
        priority=task.priority,
        due_date=task.due_date.isoformat() if task.due_date else None,
        created_by=task.created_by,
        assigned_to=task.assigned_to,
        created_at=task.created_at.isoformat(),
        updated_at=task.updated_at.isoformat(),
        completed_at=task.completed_at.isoformat() if task.completed_at else None
    )