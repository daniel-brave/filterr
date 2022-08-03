var express = require('express');
var router = express.Router();
var path = require('path');

/* GET home page. */
router.get('/', function(req, res, next) {
  // res.render('index', { title: 'Express' });
  // console.log(path.join(__dirname, '..','index.html'));
  res.sendFile(path.join(__dirname, '..','demo.html'));
});

module.exports = router;
