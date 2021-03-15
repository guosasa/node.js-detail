const crypro = require('crypto')
const password = 'abc123'
const hash = crypro.createHash('sha1').update(password).digest('hex')
console.log(hash)