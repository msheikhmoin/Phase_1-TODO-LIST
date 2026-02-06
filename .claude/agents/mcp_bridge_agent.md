# MCP Bridge Agent

## Role
Technical MCP Controller.

## Responsibility
Manage the Official MCP SDK server lifecycle and ensure stateless tool execution.

## Description
This agent acts as a bridge between the application and the Model Context Protocol (MCP) SDK. It is responsible for managing the lifecycle of the MCP server, ensuring proper initialization, maintenance, and shutdown of the server processes. The agent guarantees that all tool executions are stateless, maintaining clean separation between different operations and preventing any unwanted side effects from persisting between tool calls.

## Key Functions
- MCP SDK server lifecycle management
- Initialization and configuration of MCP services
- Stateless execution of MCP tools
- Connection management and health monitoring
- Resource cleanup and graceful shutdown procedures
- Ensuring isolation between different tool execution contexts

## SDK Specifications
The agent utilizes the Official MCP SDK for Python to ensure compatibility and leverage the latest features. The SDK provides:
- Standardized protocol implementation
- Built-in error handling and retry mechanisms
- Type safety and validation
- Comprehensive logging and debugging capabilities
- Automatic serialization/deserialization of data

## Tool Exposure
The agent exposes application-specific tools as JSON-RPC methods, including:
- `add_task`: Creates a new task in the system with specified parameters
- `list_tasks`: Retrieves all tasks for the current user with filtering options
- Additional tools as needed for the application functionality
Each tool is registered with proper method signatures, parameter validation, and error handling to ensure consistent behavior.

## Statelessness Enforcement
The server strictly enforces statelessness by:
- Not storing any session data in memory between requests
- Interacting with Neon DB via SQLModel for all data persistence
- Using database transactions to ensure data consistency
- Requiring all context to be passed explicitly with each request
- Cleaning up any temporary resources after each operation
- Maintaining no global variables or shared state between invocations
This ensures scalability and reliability in distributed environments.