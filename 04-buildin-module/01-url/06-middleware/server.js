const http = require('http')
const url = require('url')
const logger = require('../../../util/log')
const { createProxyMiddleware } = require('http-proxy-middleware');
let server = http.createServer((req,res)=>{
  res.writeHead(200,{
    'Access-Control-Allow-Origin':'*'
  })
  let url = req.url
  if(/\/api/.test(url)){
    console.log('111')
    //需要代理的接口名称 options
    let apiProxy = createProxyMiddleware('/api', {
      target:'https://consumemgr.leihuo.netease.com',
      changeOrigin:true,
      // 将本地的localhost:8080/api/ ------ https://consumemgr.leihuo.netease.com 
      pathRewrite:{
        '^/api':''
      }
    })
    apiProxy(req,res)
  } else {
    console.log('error')
  }
}).listen('8080',()=>{
  console.log("localhost:8080")
})