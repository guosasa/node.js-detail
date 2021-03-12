const logger = require('../../../util/log.js')
const http = require("http");
const https = require("https");
const querystring = require('querystring');

const postData = querystring.stringify({
  province:'上海',
  city:"上海",
  district:'宝山区',
  address:'同济大学',
  latitude:43,
  message:'求购一条小鱼',
  contact:'1366666',
  type:'sell',
  time:1571217561
})
const options = {
  protocol: 'http:',
  hostname:'localhost',
  port:'3000',
  method:'post',
  path:'/data',
  headers:{
    'Content-Type':'application/x-www-form-urlencoded',
    'Content-Length':Buffer.byteLength(postData)
  }
}
const httpServer = http.createServer((request,response)=>{
  const req =http.request(options,(res)=>{
    console.log(res)
  })
  req.write(postData)
  req.end()
  response.end()
})
httpServer.listen('8080',()=>{
  console.log('localhost:8080')
})