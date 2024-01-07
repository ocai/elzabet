'use strict'

const bet = require('../../src/controllers/bet');
const { dbConn } = require('../../config/db.config');
const f = require('../support/factory');

test('Bet: create', async () => {
    const res = await bet.create({'userId': 1337, 'gameId': 1, 'playerId': 1337, 'option': 'win', 'amount': 100 });
    expect(res['gameId']).toBe(1);
});

test('Bet: getByPlayer', async () => {
    const user = dbConn('users').insert(f.user());
    const [player] = await dbConn('players').insert(f.player());
    const game1 = dbConn('games').insert(f.game({'playerId': player}));
    const game2 = dbConn('games').insert(f.game({'playerId': player}));
    await Promise.all([user, game1, game2]);
    // 3 Test bets
    const bet1 = dbConn('bets').insert(f.bet({'playerId': player})).then(([id]) => { return id });
    const bet2 = dbConn('bets').insert(f.bet({'playerId': player})).then(([id]) => { return id });
    const bet3 = dbConn('bets').insert(f.bet({'playerId': player})).then(([id]) => { return id });
    await Promise.all([bet1, bet2, bet3]);
    const bets = await bet.getByPlayer(player);
    expect(bets.length).toBe(3);
    const ownedByPlayer = (item) => { return item['playerId'] == player };
    expect(bets.every(ownedByPlayer)).toBe(true);
});

test('Bet: getByGame', async () => {
    const [game] = await dbConn('games').insert(f.game());
    const bet1 = dbConn('bets').insert(f.bet({'gameId': game})).then(([id]) => { return id });
    const bet2 = dbConn('bets').insert(f.bet({'gameId': game})).then(([id]) => { return id });
    const bet3 = dbConn('bets').insert(f.bet({'gameId': game})).then(([id]) => { return id });
    await Promise.all([bet1, bet2, bet3]);
    const bets = await bet.getByGame(game);
    expect(bets.length).toBe(3);
    console.log('bets: ', bets);
    const ownedByGame = (item) => { return item['gameId'] == game };
    expect(bets.every(ownedByGame)).toBe(true);
});

test('Bet: updateByGame', async () => {
    const [game] = await dbConn('games').insert(f.game());
    const bet1 = await dbConn('bets').insert(f.bet({'gameId': game, 'option': 'loss'})).then(([id]) => { return id });
    const bet2 = await dbConn('bets').insert(f.bet({'gameId': game, 'option': 'win'})).then(([id]) => { return id });
    const bet3 = await dbConn('bets').insert(f.bet({'gameId': game, 'option': 'win'})).then(([id]) => { return id });
    expect([bet1, bet2, bet3].every((item) => { return item['result'] == null })).toBe(true);
    await bet.updateByGame(game, 'win');
    const bet1Updated = await dbConn('bets').first('result').where('id', '=', bet1);
    expect(bet1Updated['result']).toBe('loss');
    const bet2Updated = await dbConn('bets').first('result').where('id', '=', bet2);
    expect(bet2Updated['result']).toBe('win');
    const bet3Updated = await dbConn('bets').first('result').where('id', '=', bet3);
    expect(bet3Updated['result']).toBe('win');
});