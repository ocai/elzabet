const express = require('express');
const router = express.Router();

const riot = require('./services/riot')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/hello-world', function(req, res, next) {
    res.send("Hello world");
  });

router.get('/test', function(req, res) { 
    const test = riot.getSummonerInfo('tspin2win');
    test.then((response) => {
        // console.log(response.data)
        res.json(response.data); 
    })
  }); 

module.exports = router;