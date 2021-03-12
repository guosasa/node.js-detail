创建应用的访问的主要流程是: 
### http.createServer 在server中进行http.get 或者是http.post请求。
```
const options = {
  protocol: 'http:',
  hostname:'localhost',
  port:'3000',
  method:'post',
  path:'/data',
  header:{
    'content-type':'application/x-www-form-urlencoded',
    'content-Length':Buffer.byteLength(postData)
  }
}
const httpServer = http.createServer((request,response)=>{
  const req =http.request(options,(res)=>{
    
  })
  req.write(postData)
  req.end()
})
```
### 使用npm install express-generator -g 安装express的web应用框架，服务的端口号是3000，这样就可以访问一个类似于接口的东西
