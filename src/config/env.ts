import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT || 4000,
    googleApiKey: process.env.GOOGLE_API_KEY || '',
    mcpUrl: process.env.MCP_URL || 'http://localhost:3000/api/mcp',

    // Database configuration
    db: {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT) || 5432,
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'todo',
        database: process.env.DB_NAME || 'todo_app',
    },

    // CORS
    corsOrigins: [
        'http://localhost:5173',
        'http://localhost:5174',
        'http://localhost:5175'
    ],
    retentionDays: Number(process.env.RETENTION_DAYS) || 90,
}

// Validate required environment variables
if (!config.googleApiKey) {
  throw new Error('GOOGLE_API_KEY is required');
}