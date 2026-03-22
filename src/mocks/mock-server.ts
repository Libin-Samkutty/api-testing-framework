import http from 'node:http';
import { Logger } from '../utils/logger';

export interface MockRoute {
  method: string;
  path: string;
  handler: MockHandler;
}

export type MockHandler = (
  req: http.IncomingMessage,
  body: string,
) => { status: number; body: unknown; delay?: number };

export class MockServer {
  private server: http.Server | null = null;
  private routes: MockRoute[] = [];
  private readonly logger = new Logger('MockServer');

  /** Register a route handler */
  register(method: string, path: string, handler: MockHandler): void {
    this.routes.push({ method: method.toUpperCase(), path, handler });
    this.logger.debug(`Registered ${method.toUpperCase()} ${path}`);
  }

  /** Clear all registered routes */
  reset(): void {
    this.routes = [];
    this.logger.debug('All routes cleared');
  }

  /** Start the server on the given port */
  async start(port: number): Promise<void> {
    return new Promise((resolve, reject) => {
      this.server = http.createServer(async (req, res) => {
        const chunks: Buffer[] = [];
        req.on('data', (c) => chunks.push(c));
        req.on('end', async () => {
          const bodyStr = Buffer.concat(chunks).toString();
          const urlPath = req.url?.split('?')[0] ?? '';
          const route = this.routes.find(
            (r) => r.method === req.method && r.path === urlPath,
          );

          if (!route) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Mock route not found' }));
            return;
          }

          const result = route.handler(req, bodyStr);

          if (result.delay) {
            await new Promise((r) => setTimeout(r, result.delay));
          }

          if (result.status === 204) {
            res.writeHead(result.status);
            res.end();
          } else {
            res.writeHead(result.status, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(result.body));
          }
        });
      });

      this.server.on('error', reject);
      this.server.listen(port, () => {
        this.logger.info(`Mock server listening on http://localhost:${port}`);
        resolve();
      });
    });
  }

  /** Stop the server */
  async stop(): Promise<void> {
    return new Promise((resolve) => {
      if (!this.server) return resolve();
      this.server.close(() => {
        this.logger.info('Mock server stopped');
        this.server = null;
        resolve();
      });
    });
  }

  get baseURL(): string {
    const addr = this.server?.address();
    if (addr && typeof addr === 'object') return `http://localhost:${addr.port}`;
    return '';
  }
}