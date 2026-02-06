# Stateless DB Manager Skill

## Purpose
Manage persistence for the stateless chat cycle.

## Technical Specifications

### fetch_history Tool
**Description:** Retrieves conversation history for a specific conversation
**Parameters:**
- `conversation_id` (string, required): Unique identifier for the conversation

**Return Format:** `{"status": "success", "messages": [{"role": "user", "content": "Hello", "timestamp": "2023-01-01T00:00:00Z"}, ...], "count": 5}`

**Implementation Details:**
- Uses SQLModel to query the Message table
- Joins with Conversation table to ensure proper association
- Orders messages chronologically by timestamp
- Handles Roman Urdu text correctly in the PostgreSQL DB
- Returns an array of message objects with role, content, and timestamp

### save_message Tool
**Description:** Saves a message to the conversation history
**Parameters:**
- `conversation_id` (string, required): Unique identifier for the conversation
- `role` (string, required): Role of the message sender (user, assistant, system)
- `content` (string, required): Content of the message, supporting Roman Urdu text

**Return Format:** `{"status": "saved", "message_id": 123, "message": "Message saved successfully"}`

**Implementation Details:**
- Uses SQLModel to create a new record in the Message table
- Associates the message with the correct Conversation record
- Properly encodes and stores Roman Urdu text in PostgreSQL
- Sets the current timestamp for the message
- Returns confirmation with the generated message ID

## Database Interaction
- Both tools interact with Conversation and Message tables using SQLModel
- Proper foreign key relationships are maintained between conversations and messages
- All string fields are configured to support Unicode characters for Roman Urdu
- PostgreSQL-specific configurations ensure proper collation and encoding for multilingual support

## Roman Urdu Text Handling
- Database columns use UTF-8 encoding to properly store Roman Urdu characters
- Input validation ensures text integrity before storage
- Retrieval preserves the original formatting and character set
- Special handling for common Roman Urdu transliterations and diacritics