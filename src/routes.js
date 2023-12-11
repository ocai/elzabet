const express = require('express');
const router = express.Router();

const riot = require('./services/riot');

const players = require('./controllers/player');
const { sendMessage } = require('./controllers/discord');
const user = require('./controllers/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/hello-world', function(req, res, next) {
  res.send("Hello world");
});

router.get('/test/:summonerName', function(req, res) { 
  const test = riot.getActiveGameBySummoner(req.params.summonerName);
  test.then((response) => {
    res.json(response.data); 
  })
});

// Player Routes
router.get('/players/:id', async function(req, res) {
  const player = await players.getBySummonerName(req.params.id)
  res.json(player)
})

router.get('/players/create/test', async function(req, res) {
  const player = await players.create({'summonerName': 'test', 'riotId': 'test'})
  res.json(player)
})

// Test Route for Discord Message - delete later
router.get('/discord/test', async function(req, res) {
  const message = await sendMessage("this is a message")
  res.json(message.data)
})

// Test Route for Discord Message - delete later
router.get('/discord/new', async function(req, res) {
  const message = await sendMessage("this is a new message")
  res.json(message.data)
})

// User routes
router.get('/users/:id/stats', async function(req, res) {
  const stats = await user.getBetStats(req.params.id);
  res.json(stats);
})

module.exports = router;