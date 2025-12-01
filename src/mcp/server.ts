import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { todoManagerTool } from './tools/todo.tools.js';
import { TodoInputSchema } from './schemas/todo.schemas.js';



// create the MCP server
export const mcpServer = new McpServer({
    name: 'Todo Manager MCP Server',
    version: '1.0.0',
})

mcpServer.registerTool(
    todoManagerTool.name,
    {
        description: todoManagerTool.description,
        inputSchema:TodoInputSchema
    },
    todoManagerTool.handler,
);
