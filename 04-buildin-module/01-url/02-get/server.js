const logger = require('../../../util/log.js')
const http = require("http");
const https = require("https");
const querystring = require('querystring');

const httpServer = http.createServer((request,response)=>{

  // get 请求
  https.get("https://pcw-api.iqiyi.com/resource/resource/online/7833872612",(result)=>{
    let data = ''
    result.on('data',(chunk)=>{
      data+=chunk
    })
    result.on('end',()=>{
      response.writeHead(200, { 'content-type': 'application/json:charset=utf-8' });
      response.write(data)
      response.end()      
    })
  })
  
})
httpServer.listen('8080',()=>{
  console.log('localhost:8080')
})