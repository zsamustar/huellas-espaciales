const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css' };
http.createServer((request, response) => {
  const route = request.url.split('?')[0] === '/' ? '/index.html' : request.url.split('?')[0];
  const file = path.resolve(root, `.${route}`);
  if (!file.startsWith(root)) { response.writeHead(403); return response.end(); }
  fs.readFile(file, (error, data) => {
    if (error) { response.writeHead(404); return response.end(); }
    response.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
    response.end(data);
  });
}).listen(4173, '127.0.0.1');
