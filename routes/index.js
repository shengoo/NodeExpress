var express = require('express');
var router = express.Router();
var mongo = require('../mongo');
// This is a middleware that we will use on routes where
// we _require_ that a user is logged in, such as the /secret url
function requireUser(req, res, next){
  if (!req.user) {
    res.redirect('/not_allowed');
  } else {
    next();
  }
}
/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});


router.get('/login', function(req, res){
  res.render('login');
});

router.get('/logout', function(req, res){
  delete req.session.username;
  res.redirect('/');
});

router.get('/not_allowed', function(req, res){
  res.render('not_allowed');
});

// The /secret url includes the requireUser middleware.
router.get('/secret', requireUser, function(req, res){
  res.render('secret');
});

router.get('/signup', function(req,res){
  res.render('signup');
});

router.post('/signup', function(req, res){
  var password = req.body.password;
  var name = req.body.name;
  var idno = req.body.idno;
  var password_confirmation = req.body.password_confirmation;
  
  createUser(name, idno, password, password_confirmation,  function(err, user){
    if (err) {
      res.render('signup', {error: err});
    } else {
      
      // This way subsequent requests will know the user is logged in.
      req.session.name = user.name;
      
      res.redirect('/');  
    }
  });
});

function createSalt(){
  var crypto = require('crypto');
  return crypto.randomBytes(32).toString('hex');
}

function createHash(string){
  var crypto = require('crypto');
  return crypto.createHash('sha256').update(string).digest('hex');
}
function createUser(name, idno, password, password_confirmation, callback){
  var coll = mongo.collection('users');
  
  if (password !== password_confirmation) {
    var err = 'The passwords do not match';
    callback(err);
  } else {
    var query      = {name:name};
    var salt       = createSalt();
    var hashedPassword = createHash(password + salt);
    var userObject = {
      name: name,
      idno: idno,
      salt: salt,
      hashedPassword: hashedPassword
    };
    
    // make sure this name does not exist already
    coll.findOne(query, function(err, user){
      if (user) {
        err = 'The name you entered already exists';
        callback(err);
      } else {
        // create the new user
        coll.insert(userObject, function(err,user){
          callback(err,user);
        });
      }
    });
  }
}

// This finds a user matching the username and password that
// were given.
function authenticateUser(name, password, callback){
  var coll = mongo.collection('users');
  
  coll.findOne({name: name}, function(err, user){
    if (err) {
      return callback(err, null);
    }
    if (!user) {
      return callback(null, null);
    }
    var salt = user.salt;
    var hash = createHash(password + salt);
    if (hash === user.hashedPassword) {
      return callback(null, user);
    } else {
      return callback(null, null);
    }
  });
}

router.post('/login', function(req, res){
  // These two variables come from the form on
  // the views/login.hbs page
  console.log(req.body)
  var name = req.body.name;
  var password = req.body.password;
  
  authenticateUser(name, password, function(err, user){
    if (user) {
      // This way subsequent requests will know the user is logged in.
      req.session.name = user.name;

      res.redirect('/');
    } else {
      res.render('login', {badCredentials: true});
    }
  });
});

module.exports = router;
