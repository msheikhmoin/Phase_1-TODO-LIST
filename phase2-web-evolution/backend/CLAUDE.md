# Backend Development Guidelines

## Technology Stack
- **Framework**: FastAPI for high-performance web API development
- **ORM**: SQLModel for database modeling with SQLAlchemy and Pydantic integration
- **Package Manager**: uv for fast Python package management and project initialization

## Project Structure
- `/models.py` - Database models using SQLModel
- `/db.py` - Database connection and session management
- `/routes/` - API route definitions
- `/services/` - Business logic implementations
- `/utils/` - Utility functions and helpers
- `/schemas/` - Pydantic schemas for request/response validation

## Development Rules
1. Follow FastAPI best practices for dependency injection and async programming
2. Use SQLModel for all database models with proper relationships
3. Implement proper error handling with custom exceptions
4. Use environment variables for configuration
5. Follow RESTful API design principles
6. Implement proper logging and monitoring
7. Use Pydantic models for all request/response validation
8. Maintain clean separation of concerns between layers

## Security Guidelines
- Never expose sensitive data in logs
- Validate and sanitize all inputs
- Use proper authentication and authorization
- Implement rate limiting where appropriate
- Use secure coding practices

## Database Guidelines
- Use SQLModel with proper indexing as specified in schema
- Implement proper transaction management
- Use connection pooling for performance
- Follow ACID principles for data integrity
- Implement proper error handling for database operations