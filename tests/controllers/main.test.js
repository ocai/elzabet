'use strict'

const main = require('../../src/controllers/main');
const { dbConn } = require('../../config/db.config');
const f = require('../support/factory');
jest.mock('../../src/services/riot');

describe('HandleResponse: 200', () => {
    test('Creates a new game if one does not exist', async () => {
        await main.handleResponse(200, {'playerId': 1, 'riotGameId': 'test1'});
        const newGame = await dbConn('games').first(['*']).from('games').where('riotGameId', '=', 'test1');
        expect(newGame).toBeTruthy();
        expect(newGame.riotGameId).toBe('test1');
    });
    test('Updates a game status to in_progress if it exists and the time cutoff is past', async () => {
        const [gameId] = await dbConn('games').insert(f.game({
                'playerId': 2,
                'riotGameId': 'test2',
                'status': 'bettable'
            }));
        await main.handleResponse(200, {'playerId': 2, 'riotGameId': 'test2'});
        const updatedGame = await dbConn('games').first(['*']).from('games').where('id', '=', gameId);
        expect(updatedGame.status).toBe('in_progress');
    });
    test('Does NOT update game status if time cutoff is not past', async () => {
        const [gameId] = await dbConn('games').insert(f.game({
            'playerId': 2,
            'riotGameId': 'test3',
            'status': 'bettable',
            'createdAt': new Date(),
            'updatedAt': new Date()
        }));
        const inserted = await dbConn('games').first(['*']).where('id', '=', gameId);
        await main.handleResponse(200, {'playerId': 2, 'riotGameId': 'test3'});
        const after = await dbConn('games').first(['*']).where('id', '=', gameId);
        expect(inserted).toStrictEqual(after);
    });
});

describe('HandleResponse: 404', () => {
    test('Does nothing if no in_progress game exists for the player', async () => {
        const res = await main.handleResponse(404, {'playerId': 404, 'riotGameId': null})
        expect(res).toBeFalsy();
    });
    test('Updates status and result if game is found for the player', async () => {
        const [gameId] = await dbConn('games').insert(f.game({
            'playerId': 808,
            'riotGameId': 'test4',
            'status': 'in_progress',
            'result': null
        }));
        await main.handleResponse(404, {'playerId': 808, 'summonerName': 'ElzIsRad', 'riotGameId': null});
        const updated = await dbConn('games').first(['*']).where('id', '=', gameId);
        expect(updated.status).toBe('final');
        expect(updated.result).toBe('win');
    });
    // test('Does Bet Payouts', async () => {
    //     const [gameId] = await dbConn('games').insert(f.game({
    //         'playerId': 909,
    //         'riotGameId': 'test_bet',
    //         'status': 'in_progress',
    //         'result': null
    //     }));
    //     const [user1] = await dbConn('users').insert(f.user({'discordId': 'mmmoishi'}));
    //     const [user2] = await dbConn('users').insert(f.user({'discordId': 'snorlax_tspins'}));
    //     await dbConn('bets').insert(f.bet({'userId': user1, 'gameId': gameId, 'option': 'win', 'amount': 500}));
    //     await dbConn('bets').insert(f.bet({'userId': user2, 'gameId': gameId, 'option': 'lose', 'amount': 1000}));
    //     await main.handleResponse(404, {'playerId': 909, 'summonerName': 'ElzIsRad', 'riotGameId': null});
    //     const payout1 = await dbConn('users').first(['*']).where('id', '=', user1);
    //     expect(payout1.points).toBe(2000);
    //     const payout2 = await dbConn('users').first(['*']).where('id', '=', user2);
    //     expect(payout2.points).toBe(3000);
    // })
})
