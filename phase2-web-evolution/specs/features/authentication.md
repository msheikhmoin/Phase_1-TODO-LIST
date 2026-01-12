# Feature Specification: Authentication & Authorization

## 1. Purpose
This specification defines the secure authentication and authorization system for the multi-user Todo application. The system implements a robust security architecture using Better Auth for frontend authentication and FastAPI JWT verification for backend authorization, ensuring complete user isolation and data protection.

## 2. Scope (Phase II)
This specification covers the implementation of user authentication and authorization for Phase II (Full-Stack Web Application). The scope includes:
- Frontend authentication using Better Auth
- JWT token generation, validation, and management
- Backend authorization middleware in FastAPI
- User identity extraction and verification
- Cross-service authentication coordination
- Security enforcement across all user operations

## 3. Authentication Flow Overview
The authentication flow consists of two coordinated layers:
1. **Frontend Layer**: Better Auth handles user registration, login, and JWT generation
2. **Backend Layer**: FastAPI verifies JWT tokens and extracts user identity for authorization
3. **Integration Point**: JWT tokens passed via Authorization header from frontend to backend
4. **Verification**: Backend validates token authenticity before processing any request

**Flow Sequence**:
- User initiates login/registration via frontend
- Better Auth validates credentials and generates signed JWT
- Frontend stores JWT securely (HTTP-only cookie or secure local storage)
- All backend API requests include JWT in Authorization header
- FastAPI middleware intercepts request and validates JWT
- Verified user identity extracted and attached to request context
- Request processed with user-specific data access rules applied

## 4. Frontend Authentication (Better Auth)
**Implementation**: Better Auth integrated into Next.js frontend application

**Configuration Requirements**:
- **Shared Secret**: Same `BETTER_AUTH_SECRET` used by both frontend and backend
- **JWT Algorithm**: RS256 (RSA Signature with SHA-256)
- **Token Lifetime**: 24 hours for access tokens
- **Refresh Token**: 7-day validity with automatic renewal

**Supported Operations**:
- User registration with email, username, and password
- User login with email/password authentication
- Password reset and account verification
- Session management with automatic token refresh
- Secure token storage and transmission

**Token Management**:
- JWT tokens stored securely in HTTP-only cookies when possible
- Client-side token refresh before expiration
- Automatic logout on token validation failure
- Token cleanup on user logout

## 5. JWT Token Strategy
**Token Format**: Standard JWT with three parts (header.payload.signature)

**Payload Claims**:
- `sub`: Subject identifier (user ID)
- `iat`: Issued at timestamp
- `exp`: Expiration timestamp
- `jti`: JWT ID for token tracking
- `user_id`: Unique user identifier for authorization
- `email`: User email for identification (read-only)

**Token Generation**:
- Performed exclusively by Better Auth on successful authentication
- Signed using RS256 algorithm with Better Auth private key
- Contains essential user identification data
- Valid for 24 hours from issuance

**Token Validation**:
- Performed by FastAPI middleware on every protected endpoint
- Verifies signature authenticity using Better Auth public key
- Checks token expiration against current time
- Validates token integrity and structure

**Token Refresh**:
- Frontend handles automatic refresh for tokens within 15 minutes of expiration
- Refresh tokens valid for 7 days with renewal mechanism
- Silent refresh occurs before token expiry
- Graceful handling of refresh failures

## 6. Backend Authorization (FastAPI JWT verification)
**Middleware Implementation**: FastAPI dependency that validates JWT tokens

**Authorization Header Processing**:
- Extract token from `Authorization: Bearer <token>` header
- Validate header format and presence
- Parse and verify JWT signature
- Extract user identity from verified token

**Dependency Injection**:
```python
def get_current_user(authorization: str = Header(...)) -> UserIdentity:
    """
    FastAPI dependency to validate JWT and extract user identity
    """
    # Implementation validates JWT and returns user identity
    # Used as dependency in all protected endpoints
```

**User Identity Context**:
- Verified user_id attached to request context for all handlers
- User identity available to all route handlers automatically
- No need for redundant authentication checks within handlers
- Consistent user context across all backend operations

**Protected Endpoint Pattern**:
```python
@app.get("/api/tasks")
def get_user_tasks(current_user: UserIdentity = Depends(get_current_user)):
    # current_user contains verified user identity from JWT
    # Handler can safely use current_user.user_id for data access
```

## 7. User Identity Source of Truth
**Single Source Principle**: JWT token payload contains verified user identity

**Identity Extraction**:
- User ID extracted from `user_id` claim in JWT payload
- Email and other user data available from token claims
- No user-provided data trusted for identity purposes
- Backend never relies on user_id from request body or URL

**Verification Chain**:
- Better Auth creates JWT with verified user identity
- Backend validates JWT signature against Better Auth public key
- User identity confirmed as authentic through verification
- Request processed with verified identity context

**Trust Model**:
- Frontend authentication establishes user identity
- JWT serves as portable authentication evidence
- Backend trusts only verified JWT claims
- No external identity sources accepted

## 8. Security Rules (User Isolation)
**Core Principle**: Complete data isolation between users

**Authorization Enforcement**:
- All database queries filtered by verified user_id from JWT
- No user can access another user's data regardless of request structure
- User_id from request body or URL completely ignored
- Only JWT-verified user_id used for data access decisions

**Database Query Patterns**:
```sql
-- Correct pattern: Filter by verified user_id from JWT
SELECT * FROM tasks WHERE created_by = :verified_user_id;

-- Incorrect pattern: Never use user_id from request
SELECT * FROM tasks WHERE created_by = :request_user_id;
```

**Cross-User Access Prevention**:
- 404 responses for unauthorized access attempts (not 403)
- Prevents user enumeration attacks
- No information leakage between users
- Consistent security posture across all endpoints

**API Endpoint Protection**:
- Every protected endpoint validates JWT and extracts user identity
- All data access filtered by verified user identity
- No exceptions to user isolation rules
- Consistent security enforcement

## 9. Error Scenarios
**JWT Validation Failures**:
- `401 Unauthorized`: Invalid, expired, or malformed JWT
- `401 Unauthorized`: Signature verification failure
- `401 Unauthorized`: Missing Authorization header
- Proper error messages without security information disclosure

**Authentication State Issues**:
- `401 Unauthorized`: Session expired, token invalid
- `401 Unauthorized`: Token tampering detected
- `401 Unauthorized`: Algorithm mismatch or unsupported

**Authorization Failures**:
- `404 Not Found`: User attempts to access non-owned resources
- `404 Not Found`: Resource exists but belongs to another user
- Prevents user enumeration while maintaining security

**Token Management Errors**:
- `401 Unauthorized`: Token refresh failure
- `401 Unauthorized`: Refresh token expired
- Graceful handling with frontend notification

**System Errors**:
- `500 Internal Server Error`: JWT verification service unavailable
- `500 Internal Server Error`: Key validation failure
- Proper logging for debugging without information disclosure

## 10. Non-Goals
**Advanced Authentication Methods**:
- OAuth providers (Google, GitHub, etc.) integration
- Multi-factor authentication (MFA)
- Biometric authentication
- Social login providers

**Enhanced Token Management**:
- Token blacklisting for immediate revocation
- Fine-grained token scopes or permissions
- Token introspection endpoints
- Advanced token lifecycle management

**Authorization Extensions**:
- Role-based access control (RBAC)
- Permission matrices or ACLs
- Organization-based access control
- Administrative privilege levels

**Security Enhancements Beyond Scope**:
- Certificate-based authentication
- Hardware security keys
- Advanced fraud detection
- Behavioral authentication analysis

**Performance Optimizations**:
- Distributed token validation
- Caching strategies for JWT verification
- Token pre-validation services
- Asynchronous validation mechanisms

**Monitoring and Analytics**:
- Authentication event tracking
- Login attempt analysis
- Security incident correlation
- User behavior analytics