# Todo App Backend

A RESTful API backend for a Todo application built with Express.js, TypeScript, and PostgreSQL, featuring MCP (Model Context Protocol) integration.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js 5
- **Language**: TypeScript
- **Database**: PostgreSQL
- **Validation**: Zod
- **MCP SDK**: @modelcontextprotocol/sdk

## Prerequisites

- Node.js (v18+)
- PostgreSQL (v14+)
- npm or yarn

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create a `.env` file in the root directory:

```env
PORT=3000
CROSS_ORIGIN=http://localhost:5173

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=todo_db
```

### 3. Database Setup

Make sure PostgreSQL is running, then run migrations:

```bash
npm run migrate
```

### 4. Run the Server

**Development mode** (with hot reload):

```bash
npm run dev
```

**Production mode**:

```bash
npm run build
npm start
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Run production server |
| `npm run migrate` | Run database migrations |
