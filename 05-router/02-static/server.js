const http = require('http')
const mime = require('mime')
const fs = require('fs')
const url = require('url')
const path = require('path')
http.createServer((req,res)=>{
  let urlString = req.url
  // 当前文件所在的物理路径
  let filePathName = path.resolve(__dirname,'./public',urlString)

  let ext = url.parse(urlString).ext
  console.log(ext)
  res.write('hello')
  res.end()
}).listen('8080',()=>{
  console.log('localhost:8080')
})