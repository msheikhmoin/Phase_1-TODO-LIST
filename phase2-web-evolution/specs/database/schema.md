# Database Schema Specification

## Overview
This document defines the database schema for the Todo application using SQLModel with Neon DB as the PostgreSQL provider. The schema follows spec-driven development principles with comprehensive indexing and timestamp management.

## Database Configuration
- **Database Provider**: Neon DB (PostgreSQL 14+)
- **ORM**: SQLModel (SQLAlchemy + Pydantic)
- **Connection Pooling**: Built-in Neon connection pooling
- **SSL Mode**: Required for production
- **Migration Tool**: Alembic

## Core Models

### User Model
```sql
-- SQLModel Definition
class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    email: str = Field(sa_column=Column(String, unique=True, nullable=False, index=True))
    username: str = Field(sa_column=Column(String, unique=True, nullable=False, index=True))
    password_hash: str = Field(sa_column=Column(String, nullable=False))
    full_name: str | None = Field(sa_column=Column(String))
    is_active: bool = Field(default=True)
    is_verified: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)

    # Relationships
    tasks: list["Task"] = Relationship(back_populates="user")
```

#### User Model Indexes
- `idx_users_email`: Index on email field for authentication lookups
- `idx_users_username`: Index on username field for profile lookups
- `idx_users_active`: Composite index on (is_active, created_at) for user management queries
- `idx_users_created_at`: Index on created_at for sorting and filtering

#### User Model Constraints
- Email uniqueness constraint
- Username uniqueness constraint
- Password hash not null constraint
- Created_at timestamp not null constraint
- Updated_at timestamp not null constraint

### Task Model
```sql
-- SQLModel Definition
class Task(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    title: str = Field(sa_column=Column(String, nullable=False))
    description: str | None = Field(sa_column=Column(Text))
    status: str = Field(default="pending", sa_column=Column(String, nullable=False))
    priority: str = Field(default="medium", sa_column=Column(String, nullable=False))
    due_date: datetime | None = Field(sa_column=Column(DateTime))
    created_by: int = Field(foreign_key="user.id", nullable=False)
    assigned_to: int | None = Field(foreign_key="user.id")
    created_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    updated_at: datetime = Field(default_factory=datetime.utcnow, nullable=False)
    completed_at: datetime | None = Field(sa_column=Column(DateTime))

    # Relationships
    user: User = Relationship(foreign_key="task.created_by", back_populates="tasks")
    assigned_user: User | None = Relationship(foreign_key="task.assigned_to")
```

#### Task Model Indexes
- `idx_tasks_created_by`: Index on created_by for user-specific task queries
- `idx_tasks_assigned_to`: Index on assigned_to for assignment lookups
- `idx_tasks_status`: Index on status for filtering by completion state
- `idx_tasks_priority`: Index on priority for priority-based sorting
- `idx_tasks_due_date`: Index on due_date for deadline-based queries
- `idx_tasks_created_at`: Index on created_at for chronological sorting
- `idx_tasks_composite`: Composite index on (created_by, status, priority) for dashboard queries

#### Task Model Constraints
- Foreign key constraint on created_by referencing User.id
- Foreign key constraint on assigned_to referencing User.id (nullable)
- Status field constraint (pending, in_progress, completed)
- Priority field constraint (low, medium, high, urgent)
- Title not null constraint
- Created_at timestamp not null constraint
- Updated_at timestamp not null constraint

## Timestamp Management

### Automatic Timestamps
Both User and Task models include:
- `created_at`: Automatically set to current timestamp on record creation
- `updated_at`: Automatically updated to current timestamp on any record modification

### Updated At Trigger
```sql
-- PostgreSQL trigger to automatically update updated_at field
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to both tables
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON user
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON task
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## Neon DB Specific Optimizations

### Connection Management
- Connection pooling with min 2, max 10 connections
- Connection timeout: 30 seconds
- Statement timeout: 60 seconds
- Idle connection timeout: 300 seconds

### Performance Indexes
- Partial indexes for active records only
- Expression indexes for computed fields
- Covering indexes for common query patterns

### Partitioning Strategy
- Time-based partitioning for historical data (monthly partitions)
- Horizontal sharding by user_id ranges for scale

## Migration Strategy

### Initial Schema Migration
1. Create User table with all indexes
2. Create Task table with all indexes and foreign keys
3. Set up timestamp triggers
4. Create initial admin user (if needed)

### Future Migration Considerations
- Zero-downtime migrations using Neon branching
- Shadow table approach for large table changes
- Online schema changes for minimal impact

## Security Considerations

### Data Encryption
- Column-level encryption for sensitive fields
- Transparent data encryption at rest
- SSL/TLS for data in transit

### Access Control
- Row-level security policies
- Column-level security masks
- Audit logging for sensitive operations

## Backup and Recovery

### Neon DB Features
- Continuous backup with point-in-time recovery
- Branch-based development with isolated schemas
- Automated backup retention (7 days default)

### Backup Schedule
- Daily full backups
- Continuous WAL (Write-Ahead Log) streaming
- Cross-region backup replication for disaster recovery