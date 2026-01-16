var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/auth', function(req, res, next) {
  res.render('auth', { title: 'Express' });
});

module.exports = router;
