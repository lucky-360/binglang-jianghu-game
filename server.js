const http = require('http');
const fs = require('fs');
const path = require('path');

const mime = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.svg': 'image/svg+xml' };
const dir = __dirname;

http.createServer((req, res) => {
    let file = req.url === '/' ? 'index.html' : req.url.slice(1);
    let ext = path.extname(file);
    fs.readFile(path.join(dir, file), (err, data) => {
        if (err) { res.writeHead(404); res.end('404'); return; }
        res.writeHead(200, { 'Content-Type': mime[ext] || 'text/html' });
        res.end(data);
    });
}).listen(3000, () => console.log('Server on 3000'));
