# MCP Todo Assistant

This repository implements a demo project demonstrating a **Model Context Protocol (MCP)** assistant architecture integrated with a Todo application.

The project is divided into three main components. Please refer to the `README.md` in each subdirectory for detailed setup, installation, and usage instructions.
Tutorial Source: [Building an AI-Powered Todo App with MCP](https://sapkotadeepak.com.np/blog/todo-mcp-part1-backend-setup)

## Project Structure

### 1. [Agents](./agents/README.md)
Located in `agents/`.
- **Description**: A LangChain-powered AI agent service that provides intelligent todo management through natural language conversations.
- **Key Tech**: LangChain, LangGraph, MCP Adapters, Express.
- **Details**: Go to [agents/README.md](./agents/README.md) for environment setup and running instructions.

### 2. [Backend](./backend/README.md)
Located in `backend/`.
- **Description**: A RESTful API backend and MCP server integration. It manages the Todo database and exposes tools for the agent.
- **Key Tech**: Express, TypeScript, PostgreSQL, MCP SDK.
- **Details**: Go to [backend/README.md](./backend/README.md) for database migrations and API setup.

### 3. [Frontend](./frontend/README.md)
Located in `frontend/`.
- **Description**: A modern React application providing a UI for managing todos and chatting with the AI assistant.
- **Key Tech**: React, Vite, Redux Toolkit, TypeScript.
- **Details**: Go to [frontend/README.md](./frontend/README.md) for development server and build instructions.

## Quick Links

- [Agent Service Documentation](./agents/README.md)
- [Backend API Documentation](./backend/README.md)
- [Frontend Documentation](./frontend/README.md)
