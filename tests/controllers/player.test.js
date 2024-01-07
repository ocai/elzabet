'use strict'

const player = require('../../src/controllers/player');
const { dbConn } = require('../../config/db.config');

test('Players: create', async () => {
    const res = await player.create({'summonerName': 'ElzisRad', 'riotId': 'test1'});
    expect(res['summonerName']).toBe('ElzisRad')
});

test('Players: getBySummonerName', async () => {
    await dbConn('players').insert({'summonerName': 'tspin2Win', 'riotId': 'test2'});
    const res = await player.getBySummonerName('tspin2Win')
    expect(res['summonerName']).toBe('tspin2Win')
});

test('Players: get', async () => {
    await dbConn('players').insert({'id': 8, 'summonerName': 'l0liver', 'riotId': 'test3'});
    const res = await player.get(8)
    expect(res['summonerName']).toBe('l0liver')
});