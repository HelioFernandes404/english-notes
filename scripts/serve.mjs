import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';

const htmlFile = new URL('../index.html', import.meta.url);
const server = createServer(async (req, res) => {
  if (req.url === '/favicon.ico') { res.writeHead(204); return res.end(); }
  if (!['/', '/index.html'].includes(req.url?.split('?')[0])) { res.writeHead(404); return res.end('Not found'); }
  try {
    const html = await readFile(htmlFile);
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    res.end(html);
  } catch {
    res.writeHead(503, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('O caderno ainda não foi gerado. Execute npm run build.');
  }
});
server.listen(4173, '127.0.0.1', () => console.log('Local: http://127.0.0.1:4173'));
server.on('error', error => { console.error(error.message); process.exit(1); });
