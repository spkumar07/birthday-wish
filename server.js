const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const root = __dirname;
const websitesDirectory = path.join(root, 'webs');
const port = Number(process.env.PORT) || 8000;
const maxRequestSize = 16 * 1024 * 1024;
const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.ico': 'image/x-icon',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

function sendJson(response, status, payload) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(payload));
}

function slugify(name) {
  return name
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60) || 'little-moments';
}

function readRequestBody(request) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;

    request.on('data', (chunk) => {
      size += chunk.length;
      if (size > maxRequestSize) {
        reject(new Error('Request body is too large.'));
        request.destroy();
        return;
      }
      chunks.push(chunk);
    });
    request.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    request.on('error', reject);
  });
}

async function saveWebsite(request, response) {
  try {
    const body = JSON.parse(await readRequestBody(request));
    if (typeof body.name !== 'string' || typeof body.html !== 'string' || !body.html.startsWith('<!doctype html>')) {
      sendJson(response, 400, { error: 'A name and complete HTML document are required.' });
      return;
    }

    fs.mkdirSync(websitesDirectory, { recursive: true });
    const baseName = slugify(body.name);
    let filename = `${baseName}.html`;
    let suffix = 2;
    while (fs.existsSync(path.join(websitesDirectory, filename))) {
      filename = `${baseName}-${suffix}.html`;
      suffix += 1;
    }

    fs.writeFileSync(path.join(websitesDirectory, filename), body.html, { flag: 'wx' });
    sendJson(response, 201, { filename, url: `/webs/${filename}` });
  } catch (error) {
    if (!response.headersSent && !response.destroyed) {
      sendJson(response, error instanceof SyntaxError ? 400 : 413, { error: error.message });
    }
  }
}

const server = http.createServer((request, response) => {
  const requestUrl = new URL(request.url, `http://${request.headers.host || 'localhost'}`);
  if (requestUrl.pathname === '/api/sites') {
    if (request.method !== 'POST') {
      response.writeHead(405, { Allow: 'POST' }).end();
      return;
    }
    saveWebsite(request, response);
    return;
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { Allow: 'GET, HEAD' }).end();
    return;
  }

  const pathname = decodeURIComponent(requestUrl.pathname === '/' ? '/index.html' : requestUrl.pathname);
  const filename = path.resolve(root, `.${pathname}`);
  if (filename !== root && !filename.startsWith(`${root}${path.sep}`)) {
    response.writeHead(403).end('Forbidden');
    return;
  }

  const stream = fs.createReadStream(filename);
  stream.on('open', () => {
    response.writeHead(200, {
      'Cache-Control': 'no-store',
      'Content-Type': contentTypes[path.extname(filename).toLowerCase()] || 'application/octet-stream',
    });
    if (request.method === 'HEAD') {
      response.end();
      stream.destroy();
      return;
    }
    stream.pipe(response);
  });
  stream.on('error', () => {
    if (!response.headersSent) response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Not found');
  });
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Little Moments is running at http://localhost:${port}`);
});