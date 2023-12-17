'use strict'

const game = require('../../src/controllers/game');
const { dbConn } = require('../../config/db.config');
const f = require('../support/factory');

describe('Game: get', () => {
    test('returns a game correctly using the game id', async () => {
        const [gameId] = await dbConn('games').insert(f.game(
            {
                'playerId': '1',
                'riotGameId': '4846836721',
                'riotMatchId': 'NA1_4846836721',
                'status': 'in_progress',
                'result': 'loss'
            }
        ));
        const res = await game.get(gameId);
        expect(res).toMatchObject({
            'id': expect.any(Number),
            'playerId': '1',
            'riotGameId': '4846836721',
            'riotMatchId': 'NA1_4846836721',
            'status': 'in_progress',
            'result': 'loss',
            'createdAt': expect.any(Date),
            'updatedAt': expect.any(Date)
        })
    });

    test('returns a game correctly using the playerId AND riotGameId', async () => {
        const [gameId] = await dbConn('games').insert(f.game(
            {
                'playerId': '1',
                'riotGameId': '4846836721',
                'riotMatchId': 'NA1_4846836721',
                'status': 'in_progress',
                'result': 'loss'
            }
        ));
        const res = await game.get({'playerId': '1', 'riotGameId': '4846836721'});
        expect(res).toMatchObject({
            'id': expect.any(Number),
            'playerId': '1',
            'riotGameId': '4846836721',
            'riotMatchId': 'NA1_4846836721',
            'status': 'in_progress',
            'result': 'loss',
            'createdAt': expect.any(Date),
            'updatedAt': expect.any(Date)
        })
    });

    test('returns a game correctly using the playerId AND riotMatchId', async () => {
        const [gameId] = await dbConn('games').insert(f.game(
            {
                'playerId': '1',
                'riotGameId': '4846836721',
                'riotMatchId': 'NA1_4846836721',
                'status': 'in_progress',
                'result': 'loss'
            }
        ));
        const res = await game.get({'playerId': '1', 'riotMatchId': 'NA1_4846836721'});
        expect(res).toMatchObject({
            'id': expect.any(Number),
            'playerId': '1',
            'riotGameId': '4846836721',
            'riotMatchId': 'NA1_4846836721',
            'status': 'in_progress',
            'result': 'loss',
            'createdAt': expect.any(Date),
            'updatedAt': expect.any(Date)
        })
    });

    test('returns an error if using an invalid object', async () => {
        expect(() => game.get({'gibberish': 'test'})).toThrow();
    });
});

describe('Game: create', () => {
    test('returns a game after creating an in-progress game', async () => {
        const res = await game.create(
            {
                'playerId': '1',
                'riotGameId': '4846836721',
                'riotMatchId': 'NA1_4846836721',
                'status': 'in_progress'
            }
        );
        expect(res).toMatchObject({
            'id': expect.any(Number),
            'playerId': '1',
            'riotGameId': '4846836721',
            'riotMatchId': 'NA1_4846836721',
            'status': 'in_progress',
            'result': null,
            'createdAt': expect.any(Date),
            'updatedAt': expect.any(Date)
        });
    });

    test('returns a game after creating a completed game', async () => {
        const res = await game.create(
            {
                'playerId': '1',
                'riotGameId': '4846836721',
                'riotMatchId': 'NA1_4846836721',
                'status': 'final',
                'result': 'loss'
            }
        );
        expect(res).toMatchObject({
            'id': expect.any(Number),
            'playerId': '1',
            'riotGameId': '4846836721',
            'riotMatchId': 'NA1_4846836721',
            'status': 'final',
            'result': 'loss',
            'createdAt': expect.any(Date),
            'updatedAt': expect.any(Date)
        });
    });

    test('actually creates a game in the DB', async() => {
        const res = await game.create(
            {   
                'playerId': '1',
                'riotGameId': '4846836721',
                'riotMatchId': 'NA1_4846836721',
                'status': 'final',
                'result': 'loss'
            }
        );
        const newGame = await dbConn.first(['*']).from('games').where('id', '=', res['id']);
        expect(newGame).toBeTruthy();
    });
});

describe('Game: update', () => {
    test('updates an in-progress game in the DB with a loss', async () => {
        const [gameId] = await dbConn('games').insert(f.game(
            {   
                'playerId': '1',
                'riotGameId': '4846836721',
                'riotMatchId': 'NA1_4846836721',
                'status': 'in_progress'
            }
        ));
        const updatedGame = await game.update({'playerId': '1', 'result': 'loss'});
        expect(updatedGame).toMatchObject({
            'playerId': '1',
            'riotGameId': '4846836721',
            'riotMatchId': 'NA1_4846836721',
            'status': 'final',
            'result': 'loss',
            'createdAt': expect.any(Date),
            'updatedAt': expect.any(Date)
        })
    });

    test('updates an in-progress game in the DB with a win', async () => {
        const [gameId] = await dbConn('games').insert(f.game(
            {   
                'playerId': '1',
                'riotGameId': '4846836721',
                'riotMatchId': 'NA1_4846836721',
                'status': 'in_progress'
            }
        ));
        const updatedGame = await game.update({'playerId': '1', 'result': 'win'});
        expect(updatedGame).toMatchObject({
            'playerId': '1',
            'riotGameId': '4846836721',
            'riotMatchId': 'NA1_4846836721',
            'status': 'final',
            'result': 'win',
            'createdAt': expect.any(Date),
            'updatedAt': expect.any(Date)
        })
    });

    test('return an error if there are no in-progress games', async () => {
        expect(() => game.update({'playerId': '1', 'result': 'win'})).toThrow();
    });

    test('return an error if passing in an invalid player', async () => {
        expect(() => game.update({'playerId': 'gibberish', 'result': 'win'})).toThrow();
    });

    test('return an error if passing in an invalid result', async () => {
        const [gameId] = await dbConn('games').insert(f.game(
            {   
                'playerId': '1',
                'riotGameId': '4846836721',
                'riotMatchId': 'NA1_4846836721',
                'status': 'in_progress'
            }
        ));
        expect(() => game.update({'playerId': '1', 'result': 'gibberish'})).toThrow();
    });
});
