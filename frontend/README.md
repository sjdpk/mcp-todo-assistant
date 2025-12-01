# Todo App Frontend

A React frontend for the Todo application with AI-powered chat integration. (TypeScript, Vite, and Redux Toolkit)

## Features

- **Todo Management** - Create, toggle, and delete todos with a clean UI
- **AI Chat Interface** - Natural language todo management via AI agent
- **Conversation Threads** - Persistent chat history with thread management
- **Real-time Streaming** - Live AI response streaming
- **Markdown Support** - Rich text rendering in chat responses
- **Responsive Design** - Mobile-friendly interface

## Prerequisites

- Node.js 18+
- Backend API running on port 3000
- Agent API running on port 4000

## Installation

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Configuration

API endpoints are configured in `src/config/constants.ts`:

```typescript
export const API_CONFIG = {
  TODO_BASE_URL: 'http://localhost:3000/api',
  CHAT_BASE_URL: 'http://localhost:4000/api',
};
```

## Routes
```bash
/ ( HomePage | Todo list management )
/chat ( ChatPage | New chat conversation)
/chat/:threadId ( ChatPage | Existing chat thread)
```

The app will start on `http://localhost:5173` with hot module replacement.

## Related Services

- **Backend** - Todo CRUD API + MCP Server (port 3000)
- **Agent** - AI Agent API (port 4000)