import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { Request, Response } from 'express';
import { mcpServer } from '../mcp/server.js';

export class McpController {
    public handleMcpRequest = async (req: Request, res: Response): Promise<void> => {
        try {
            // Create a new transport for each request to prevent request ID collisions
            const transport = new StreamableHTTPServerTransport({
                sessionIdGenerator: undefined,
                enableJsonResponse: true
            });

            // Cleaup on connection close
            res.on('close', () => transport.close())

            // Connect the Mcp server to this transport
            await mcpServer.connect(transport);

            // Handle the request and stream the response
            await transport.handleRequest(req, res, req.body);
        } catch (error: Error | any) {
            console.error('MCP Request Error:', error?.message || error);
            if (!res.headersSent) {
                res.status(500).json({
                    jsonrpc: "2.0",
                    error: {
                        code: -32000,
                        message: error?.message || 'Internal Server Error'
                    },
                    id: null
                });
            }
        }
    }
}