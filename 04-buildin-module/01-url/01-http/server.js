const logger = require('../../../util/log.js')
const http = require("http");
const https = require("https");
const querystring = require('querystring');

const httpServer = http.createServer((request,response)=>{

  
  // logger.debug(request) // 日志查看
  // debugger;  // 断点调试
  //设置文本显示内容格式
  // response.writeHead(200, { 'Content-Type': 'text/plain' });
  // response.writeHead(200, { 'content-type': 'application/json:charset=utf-8' });
  // h获取url参数，可以修改对应的路由信息

  // 获取前端返回的get 或者post的请求参数
  const url = request.url
  logger.debug(url)
  let body = '';
  request.on('data',(chunk)=>{
    body+=chunk;
  })
  request.on('end',()=>{
    //将返回的数据进行json序列化处理
    logger.debug(JSON.stringify(querystring.parse(body)))
    response.writeHead(200, { 'Content-Type': 'application/json;charset=utf-8;' });    
    response.end(body)
  })

  
})
httpServer.listen('8080',()=>{
  console.log('localhost:8080')
})