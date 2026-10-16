const http = require('http');
const fs = require('fs');
const path = require('path');
const handler = require('./api/earthquakes');
const root = path.resolve(__dirname, './build');
http.createServer(async(req,res)=>{
  if (req.url.startsWith('/api/earthquakes')) {
    res.status=n=>{res.statusCode=n;return res;};res.json=data=>{res.setHeader('Content-Type','application/json');res.end(JSON.stringify(data));};
    try { await handler(req,res); } catch {res.status(500).json({error:'Preview API error'});}return;
  }
  let file=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));
  if(!file.startsWith(root+path.sep)&&file!==root){res.statusCode=403;res.end();return;}
  if(!fs.existsSync(file)||fs.statSync(file).isDirectory())file=path.join(root,'index.html');
  const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.json':'application/json'};
  res.setHeader('Content-Type',mime[path.extname(file)]||'application/octet-stream');fs.createReadStream(file).pipe(res);
}).listen(3101,'0.0.0.0',()=>console.log('Preview http://localhost:3101'));
