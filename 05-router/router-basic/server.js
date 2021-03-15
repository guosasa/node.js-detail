const http = require('http')
const fs =require('fs')
const mime = require('mime')
http.createServer((req,res)=>{
  const urlStr = req.url
  const type = mime.getType(urlStr.slice(urlStr.lastIndexOf('.')+1))
  console.log(type);
  res.writeHead('200',{
    'content-type':type
  })
  // if(/favicon\.ico/.test(urlStr))return;
  const file = fs.readFileSync(`.${urlStr}`)
  res.end(file)
}).listen('8080',()=>{
  console.log('localhost:8080')
})