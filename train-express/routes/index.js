var express = require('express');
var router = express.Router();
var logger =  require('../../util/log')
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.post('/data',(req,res,next)=>{
  logger.debug(req.body);
  res.send('ok111')
  // res.end()
})
module.exports = router;
