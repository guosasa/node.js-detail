const fs = require('fs')
const zlib = require('zlib')

const gzip = zlib.createGzip()
const writeStream = fs.createWriteStream('./app2.gzip')
const readStream = fs.createReadStream('./app.js')
readStream
.pipe(gzip)
.pipe(writeStream)
// writeStream.write(readStream)