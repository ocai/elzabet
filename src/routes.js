const express = require('express');
const router = express.Router();

const riot = require('./services/riot')

const bets = require('./controllers/bet');
const games = require('./controllers/game');
const players = require('./controllers/player');
const users = require('./controllers/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/hello-world', function(req, res, next) {
  res.send("Hello world");
});

router.get('/test/:summonerName', async function(req, res) {
  try {
    const test = await riot.getActiveGameBySummoner(req.params.summonerName);
    res.json(test.data); 
  } catch (error) {
    error = {
      'status_code': 404,
      'message': `No active game for summoner: ${req.params.summonerName}`
    }
    res.status(404).json(error);
  }
});

// Bet Routes
router.get('/bets/by-player/:id', async function(req, res, next) {
  const bet = await bets.getByPlayer(req.params.id);

  if (bet == undefined || bet.length == 0) {
    error = {
      'status_code': 404,
      'message': 'Undefined: bet not found'
    }
    res.status(404).json(error);
  } else {
    res.json(bet);
  }
});

router.get('/bets/by-game/:id', async function(req, res) {
  const bet = await bets.getByGame(req.params.id);

  if (bet == undefined || bet.length == 0) {
    error = {
      'status_code': 404,
      'message': 'Undefined: bet not found'
    }
    res.status(404).json(error);
  } else {
    res.json(bet);
  }
})

router.get('/bets/by-user/:id', async function(req, res) {
  const bet = await bets.getByUser(req.params.id);

  if (bet == undefined || bet.length == 0) {
    error = {
      'status_code': 404,
      'message': 'Undefined: bet not found'
    }
    res.status(404).json(error);
  } else {
    res.json(bet);
  }
})

// Game Routes
router.get('/games', async function (req, res) {
  const info = {
    ...(req.query.id && { id: req.query.id }),
    ...(req.query.playerId && { playerId: req.query.playerId }),
    ...(req.query.riotGameId && { riotGameId: req.query.riotGameId }),
    ...(req.query.riotMatchId && { riotMatchId: req.query.riotMatchId }),
    ...(req.query.status && { status: req.query.status }),
    ...(req.query.result && { result: req.query.result })
  }

  if (Object.keys(info).length > 0) {
    const game = await games.get(info);

    if (game == undefined || game.length == 0) {
      error = {
        'status_code': 404,
        'message': `No games found with ${JSON.stringify(info)}`
      }
      res.status(404).json(error);
    } else {
      res.json(game);
    }
  } else {
    error = {
      'status_code': 404,
      'message': 'No games found: invalid parameters'
    }
    res.status(404).json(error);
  }
});

// Player Routes
router.get('/players/:id', async function(req, res) {
  const player = await players.get(req.params.id);

  if (player == undefined || player.length == 0) {
    error = {
      'status_code': 404,
      'message': 'Undefined: player not found'
    }
    res.status(404).json(error);
  } else {
    res.json(player);
  }
});

router.get('/players/by-summoner/:id', async function(req, res) {
  const player = await players.getBySummonerName(req.params.id);

  if (player == undefined || player.length == 0) {
    error = {
      'status_code': 404,
      'message': 'Undefined: player not found'
    }
    res.status(404).json(error);
  } else {
    res.json(player);
  }
});

router.get('/players/create/test', async function(req, res) {
  const player = await players.create({'summonerName': 'test', 'riotId': 'test'});
  res.json(player);
});

// User Routes
router.get('/users/:id', async function(req, res) {
  const user = await users.get(req.params.id);

  if (user == undefined || user.length == 0) {
    error = {
      'status_code': 404,
      'message': 'Undefined: user not found'
    }
    res.status(404).json(error);
  } else {
    res.json(user);
  }
});

router.get('/users/stats/:id', async function(req, res) {
  const stats = await users.getBetStats(req.params.id);

  if (stats == undefined || stats.length == 0) {
    error = {
      'status_code': 404,
      'message': 'Undefined: user not found'
    }
    res.status(404).json(error);
  } else {
    res.json(stats);
  }
});


// Catchall
router.get('*', async function(req, res) {
  error = {
    'status': 404,
    'message': 'Resource not found'
  }
  res.status(404).json(error);
});

module.exports = router;