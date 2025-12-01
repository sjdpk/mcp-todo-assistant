# AI Agent Service

A LangChain-powered AI agent service that provides intelligent todo management through natural language conversations. Built with LangGraph for stateful conversation management and MCP (Model Context Protocol) for tool integration.

## Features

- **AI-Powered Chat** - Natural language interface for todo management
- **MCP Integration** - Connects to backend todo tools via Model Context Protocol
- **Conversation Threads** - Persistent chat history with thread management
- **Streaming Responses** - Real-time AI response streaming
- **Context Memory** - Remembers conversation context across messages


## Prerequisites

- Node.js 18+
- PostgreSQL database
- Google API Key (for Gemini)
- Backend MCP server running

## Environment Variables

Create a `.env` file in the `agents` directory:

```env
PORT=4000
GOOGLE_API_KEY=your_google_api_key
MCP_URL=http://localhost:3000/api/mcp

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=todo
DB_NAME=todo_app

# Optional
RETENTION_DAYS=90
```

## Installation

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Run in development mode
npm run dev

# Run in production
npm start
```

## API Endpoints

### Endpoints
```bash
# Chat
[GET]: /api/health ( Health check endpoint)
[POST]: /api/chat  ( Send a message to the AI agent)

# Thread
[GET]: /api/threads ( List all conversation threads )
[GET]: /api/threads/:threadId/messages ( Get messages for a thread )
[PUT]: /api/threads/:threadId/title ( Update thread title )
[DELETE]: /api/threads/:threadId ( Delete a thread )
[POST]: /api/cleanup ( Clean up old threads )
```