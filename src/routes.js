const express = require('express');
const router = express.Router();

const riot = require('./services/riot')

const players = require('./controllers/players');
const { sendMessage } = require('./controllers/discord')

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
  const player = await players.get(req.params.id)
  res.json(player)
})

// Test Route for Discord Message - delete later
router.get('/discord/test', async function(req, res) {
  const message = await sendMessage("this is a message")
  res.json(message.data)
})

// Test route for player creation - delete later
router.get('/create/test', async function (req, res) {
  const player = await players.create({
    summoner_name: "tpsin2win",
    riot_id: 'p0oKoHC6z6_BF7dywgEuQZmi6UPXBxXKD0HltFCcaMv7oqc'
  })
  res.json(player);
})

module.exports = router;