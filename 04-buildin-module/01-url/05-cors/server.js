const http = require('http')
const url = require('url')
const logger = require('../../../util/log')
let server = http.createServer((req,res)=>{
  let urlStr = req.url
  let urlObj = url.parse(urlStr,true)
  logger.debug(urlObj)
  switch(urlObj.pathname){
    case "/api/data":
      res.writeHead('200',{
        'content-type':'application/json',
        'Access-Control-Allow-Origin':'*'
      })
      res.write('{"ret": true,"data":"hello"}')
      break;
    default:
        res.write('error')
      break;
  }
  res.end()
})
server.listen('8080',()=>{
  console.log("localhost:8080")
})