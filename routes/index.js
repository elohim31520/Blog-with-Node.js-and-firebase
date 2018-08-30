var express = require('express');
var router = express.Router();
var firebaseAdminDb = require('../connections/firebase_admin'); 

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/post', function(req, res, next) {
  res.render('post', { title: '' });
});



router.get('/dashboard/signup', function(req, res, next) {
  res.render('dashboard/signup', { title: '' });
});

module.exports = router;
