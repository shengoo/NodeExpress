var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  res.send('respond with a resource');
});

router.get('/hi',function(req,res){
   res.send('hi from /users/hi');
});

router.get('/profile',function (req,res) {
  res.render('user/profile')
});

router.post('/profile',function (req,res) {
  
})

module.exports = router;
