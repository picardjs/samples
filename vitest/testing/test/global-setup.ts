import { createServer, type Server } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

// serves the micro frontends of the samples (shared/*) for the tests
const root = fileURLToPath(new URL('../../../shared/', import.meta.url));
const types: Record<string, string> = { '.js': 'text/javascript', '.json': 'application/json' };
let server: Server;

export async function setup() {
  server = createServer(async (req, res) => {
    try {
      const path = join(root, decodeURIComponent(new URL(req.url!, 'http://localhost').pathname));
      const content = await readFile(path);
      res.writeHead(200, { 'content-type': types[extname(path)] || 'text/plain', 'access-control-allow-origin': '*' });
      res.end(content);
    } catch {
      res.writeHead(404);
      res.end();
    }
  });

  await new Promise<void>((resolve) => server.listen(4800, resolve));
}

export async function teardown() {
  await new Promise((resolve) => server.close(resolve));
}
