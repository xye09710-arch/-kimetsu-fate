const http=require('node:http'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),port=Number(process.env.PORT||8787);
http.createServer((req,res)=>{let pathname;try{pathname=decodeURIComponent(new URL(req.url,'http://localhost').pathname)}catch{res.writeHead(400);return res.end('Bad request')}
const file=path.resolve(root,'.'+(pathname.endsWith('/')?pathname+'index.html':pathname));
if(!file.startsWith(root+path.sep)){res.writeHead(403);return res.end('Forbidden')}
fs.readFile(file,(err,body)=>{if(err){res.writeHead(404);return res.end('Not found')}res.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.svg':'image/svg+xml'})[path.extname(file)]||'application/octet-stream');res.end(body)})}).listen(port,'127.0.0.1',()=>console.log(`Local: http://127.0.0.1:${port}`));
