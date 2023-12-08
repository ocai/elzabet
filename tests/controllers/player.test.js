'use strict'

const player = require('../../src/controllers/player');
const { dbConn } = require('../../config/db.config');

test('Players: create', async () => {
    const res = await player.create({'summonerName': 'ElzisRad', 'riotId': 'test'});
    expect(res['summonerName']).toBe('ElzisRad')
});

test('Players: getBySummonerName', async () => {
    await dbConn('players').insert({'summonerName': 'tspin2Win', 'riotId': 'test'});
    const res = await player.getBySummonerName('tspin2Win')
    expect(res['summonerName']).toBe('tspin2Win')
});

test('Players: get', async () => {
    await dbConn('players').insert({'id': 8, 'summonerName': 'tspin2Win', 'riotId': 'test'});
    const res = await player.get(8)
    expect(res['summonerName']).toBe('tspin2Win')
});