const log4js = require("log4js");
log4js.configure({
  appenders: { cheese: { type: "file", filename: "cheese.log" } },
  categories: { default: { appenders: ["cheese"], level: "error" } }
});

var logger = log4js.getLogger('cheese');
logger.level = "debug"
const url = require('url');
const urlString = "http://www/baidu.com:443/path/index.html?id=2#tag=3"
console.log(url.parse(urlString))
logger.debug(url.parse(urlString))
const http = require("http");
const httpServer = http.createServer((req,res)=>{

})