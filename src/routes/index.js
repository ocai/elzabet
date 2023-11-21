var express = require('express');
var router = express.Router();

const riot = require('../services/riot')

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log('TEST')
  const test = riot.getSummonerInfo("tspin2win");
  res.render('index', { title: 'Express' });
});

module.exports = router;
