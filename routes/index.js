var express = require('express');
var router = express.Router();
var mapsConfig = require('../config/private');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/maps', function (req, res, next) {
  res.render('maps', { apiKey: mapsConfig.mapsApiKey });
});

module.exports = router;
