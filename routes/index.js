var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

router.get('/hi',function(req,res){
    res.send('hi from /hi');
});

module.exports = router;
