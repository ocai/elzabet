'use strict'

const players = require('../../src/controllers/players');
const { dbConn } = require('../../config/db.config');

test('Players: create', async () => {
    const player = await players.create({'summonerName': 'ElzisRad', 'riotId': 'test'});
    expect(player['summonerName']).toBe('ElzisRad')
});

test('Players: getBySummonerName', async () => {
    await dbConn('players').insert({'summonerName': 'tspin2Win', 'riotId': 'test'});
    const player = await players.getBySummonerName('tspin2Win')
    expect(player['summonerName']).toBe('tspin2Win')
});

test('Players: get', async () => {
    await dbConn('players').insert({'id': 8, 'summonerName': 'tspin2Win', 'riotId': 'test'});
    const player = await players.get(8)
    expect(player['summonerName']).toBe('tspin2Win')
});