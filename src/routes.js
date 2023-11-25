const express = require('express');
const router = express.Router();

const riot = require('./services/riot')

const players = require('./controllers/players');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/hello-world', function(req, res, next) {
  res.send("Hello world");
});

router.get('/test/:summonerName', function(req, res) { 
  const test = riot.getSummonerInfo(req.params.summonerName);
  test.then((response) => {
      res.json(response.data); 
  })
});

// Player Routes
router.get('/players/:id', function(req, res) {
  players.get(req.params.id)
  .then((player) => { res.json(player) });
})

module.exports = router;