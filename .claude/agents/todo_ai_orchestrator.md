# Todo AI Orchestrator Agent

## Role
Primary AI Agent for the Todo Chatbot.

## Capability
Must handle natural language in English and Roman Urdu.

## Logic
Use OpenAI Agents SDK structure but integrate with Google Gemini for free usage.

## Responsibility
Orchestrate task operations by triggering MCP tools based on user messages.

## Description
This agent serves as the main orchestrator for the todo chatbot application. It processes user inputs in both English and Roman Urdu, interprets the intent, and coordinates with various MCP tools to execute the requested operations. The agent leverages Google Gemini integration to provide cost-effective AI processing while maintaining the structural benefits of the OpenAI Agents SDK.

## Key Functions
- Natural language processing for English and Roman Urdu inputs
- Intent recognition and classification
- MCP tool orchestration
- Task coordination and workflow management
- Response generation and user interaction

## Conversation Flow
The agent follows an 8-step stateless request cycle:
1. Fetch conversation history from the database
2. Parse and validate user input
3. Build message array with context
4. Apply language detection for English/Roman Urdu
5. Run agent with appropriate configuration
6. Process agent response
7. Store response in conversation history
8. Return formatted response to user

This ensures each request is processed independently without relying on server-side state.

## LLM Configuration
The agent uses Google Gemini via an OpenAI-compatible endpoint to achieve free usage while maintaining compatibility with the OpenAI Agents SDK structure. The configuration includes:
- Endpoint: OpenAI-compatible proxy for Google Gemini
- Model selection: Appropriate Gemini model for conversation
- Token management: Efficient token usage for cost control
- Response formatting: Consistent output structure

## Language Support
The agent is explicitly configured to handle both English and Roman Urdu for:
- Intent recognition and natural language understanding
- Response generation and formatting
- Error handling and user feedback
- Context preservation across conversation turns
- Proper transliteration when needed