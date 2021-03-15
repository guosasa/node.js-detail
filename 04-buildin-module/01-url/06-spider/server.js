const http = require('http')
const https = require('https')
const cheerio = require('cheerio');
function filterData(data){
  const $ = cheerio.load(data);
  $('.section-item-box p').each((index,el)=>{
    console.log($(el).text())
  })
}
const server = http.createServer((req, res) => {
  https.get('https://www.meizu.com/', (result) => {
    let data = ''
    result.on('data', (chunk) => {
      data += chunk
    })
    result.on('end', () => {
      filterData(data)
    })
  })
}).listen('8080')