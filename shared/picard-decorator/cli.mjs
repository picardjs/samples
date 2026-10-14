#!/usr/bin/env node
import { createServer } from 'node:http';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { getIslandsFile, getIslandsFileNames, initializePicard } from 'picard-js/node';

const usage = `Decorates HTML with the micro frontends rendered by Picard.js.

Usage:
  picard-decorator serve [--port 5100]   runs an HTTP service decorating posted HTML
  picard-decorator build <dir>           decorates the HTML files in <dir> in place

Options:
  --feed <url>         the micro frontend discovery service (env: PICARD_FEED)
  --script-url <url>   the URL of the islands script (default: /picard/picard.js)
  --port <port>        the port of the service (env: PORT, default: 5100)
`;

const { positionals, values } = parseArgs({
  allowPositionals: true,
  options: {
    feed: { type: 'string', default: process.env.PICARD_FEED || 'https://feed.piral.cloud/api/v1/microfrontends/picard-demos' },
    'script-url': { type: 'string', default: '/picard/picard.js' },
    port: { type: 'string', default: process.env.PORT || '5100' },
    help: { type: 'boolean', short: 'h' },
  },
});

const [command, target] = positionals;
const scriptUrl = values['script-url'];

const picard = initializePicard({
  feed: values.feed,
  interactive: true,
  scriptUrl,
});

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    req.on('error', reject);
  });
}

function serve(port) {
  const server = createServer(async (req, res) => {
    try {
      const { pathname } = new URL(req.url, 'http://localhost');

      if (req.method === 'POST' && pathname === '/decorate') {
        // decorates the posted HTML (a document or a fragment)
        const html = await picard.decorate(await readBody(req));
        res.writeHead(200, { 'content-type': 'text/html; charset=utf-8' });
        res.end(html);
      } else if (req.method === 'GET' && pathname.startsWith('/picard/')) {
        // serves the files of the islands script
        const content = getIslandsFile(pathname.substring('/picard/'.length));
        res.writeHead(content === undefined ? 404 : 200, { 'content-type': 'text/javascript' });
        res.end(content);
      } else {
        res.writeHead(404);
        res.end();
      }
    } catch (error) {
      console.error('Failed to handle the request', error);
      res.writeHead(500);
      res.end();
    }
  });

  server.listen(port, () => {
    console.log(`Picard.js decorator listening on http://localhost:${port} ...`);
  });
}

async function* findHtmlFiles(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);

    if (entry.isDirectory()) {
      yield* findHtmlFiles(path);
    } else if (entry.name.endsWith('.html')) {
      yield path;
    }
  }
}

async function build(dir) {
  const root = resolve(dir);
  let count = 0;

  for await (const file of findHtmlFiles(root)) {
    const html = await readFile(file, 'utf8');
    await writeFile(file, await picard.decorate(html));
    count++;
  }

  // the islands script is placed where the script URL points to, e.g., /picard/picard.js
  const scriptDir = join(root, dirname(new URL(scriptUrl, 'http://localhost').pathname));
  await mkdir(scriptDir, { recursive: true });

  for (const name of getIslandsFileNames()) {
    await writeFile(join(scriptDir, name), getIslandsFile(name));
  }

  console.log(`Decorated ${count} HTML file(s) in "${dir}".`);
}

if (values.help || !command) {
  console.log(usage);
} else if (command === 'serve') {
  serve(Number(values.port));
} else if (command === 'build' && target) {
  await build(target);
} else {
  console.error(usage);
  process.exitCode = 1;
}
