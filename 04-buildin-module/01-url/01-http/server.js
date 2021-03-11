const logger = require('../../../util/log.js')
const http = require("http");
const httpServer = http.createServer((request,response)=>{
  logger.debug(request) // 日志查看
  // debugger;  // 断点调试
})
httpServer.listen('8080',()=>{
  console.log('localhost:8080')
})