'use strict'

const user = require('../../src/controllers/user');
const { dbConn } = require('../../config/db.config');
const f = require('../support/factory');

test('User: get', async () => {
    const [userId] = await dbConn('users').insert(f.user({'username': 'snorlax'}));
    const res = await user.get(userId);
    expect(res).toMatchObject({
        'id': expect.any(Number),
        'username': 'snorlax',
        'discordId': 'test',
        'points': 1000,
        'createdAt': expect.any(Date),
        'updatedAt': expect.any(Date)
    })
});

describe('User: create', () => {
    test('returns a user', async () => {
        const res = await user.create({'username': 'snorlax_tspins', 'discordId': '40127402917470', 'points': 1000});
        expect(res).toMatchObject({
            'id': expect.any(Number),
            'username': 'snorlax_tspins',
            'discordId': '40127402917470',
            'points': 1000,
            'createdAt': expect.any(Date),
            'updatedAt': expect.any(Date)
        })
    });

    test('returns a user with default points of 1000', async() => {
        const res = await user.create({'username': 'snorlax_tspins', 'discordId': '40127402917471'});
        expect(res).toMatchObject({
            'id': expect.any(Number),
            'username': 'snorlax_tspins',
            'discordId': '40127402917471',
            'points': 1000,
            'createdAt': expect.any(Date),
            'updatedAt': expect.any(Date)
        })
    });

    test('actually creates a user in the DB', async() => {
        const res = await user.create({'username': 'snorlax_tspins', 'discordId': '40127402917472'});
        const newUser = await dbConn.first(['*']).from('users').where('id', '=', res['id'])
        expect(newUser).not.toBeFalsy()
    });
})

describe('User: updateUser', () => {
    test('returns a user correctly when adding points', async () => {
        const [userId] = await dbConn('users').insert(f.user({'username': 'snorlax', 'discordId': 'test2', 'points': 0}));
        const res = await user.update(userId, 1000);
        expect(res).toMatchObject({
            'id': expect.any(Number),
            'username': 'snorlax',
            'discordId': 'test2',
            'points': 1000,
            'createdAt': expect.any(Date),
            'updatedAt': expect.any(Date)
        })
    });
    test('returns a user correctly when subtracting points', async () => {
        const [userId] = await dbConn('users').insert(f.user({'username': 'snorlax', 'discordId': 'test3', 'points': 1000}));
        const res = await user.update(userId, -500);
        expect(res).toMatchObject({
            'id': expect.any(Number),
            'username': 'snorlax',
            'discordId': 'test3',
            'points': 500,
            'createdAt': expect.any(Date),
            'updatedAt': expect.any(Date)
        })
    });
    test('actually updates the user in the DB', async () => {
        const [userId] = await dbConn('users').insert(f.user({'username': 'snorlax', 'discordId': 'test4', 'points': 7000}));
        const res = await user.update(userId, -31);
        const updatedUser = await dbConn.first(['*']).from('users').where('id', '=', res['id']);
        expect(updatedUser).toMatchObject({
            'id': expect.any(Number),
            'username': 'snorlax',
            'discordId': 'test4',
            'points': 6969,
            'createdAt': expect.any(Date),
            'updatedAt': expect.any(Date)
        })
    });
});

describe('User: updateAll', () => {
    test('updates every user', async () => {
        let points = [100, 400, 600];
        const [userId1] = await dbConn('users').insert(f.user({'username': 'snorlax', 'discordId': 'test5', 'points': 100}));
        const [userId2] = await dbConn('users').insert(f.user({'username': 'L0Liver', 'discordId': 'test6', 'points': 400}));
        const [userId3] = await dbConn('users').insert(f.user({'username': 'zolgus', 'discordId': 'test7', 'points': 600}));
        await user.updateAll(69);
        let userIds = [userId1, userId2, userId3];
        for (let i = 0; i < 3; i++) {
            let updatedUser = await dbConn.first(['*']).from('users').where('id', '=', userIds[i]);
            expect(updatedUser['points']).toBe(points[i] + 69);
        }
    });
});

describe('User: getBetStats', () => {
    test('Bet Stats', async () => {
        const [userId] = await dbConn('users').insert(f.user({'username': 'snorlax', 'discordId': 'test8', 'points': 100}));
        const [game1] = await dbConn('games').insert(f.game({'result': 'win'}));
        const [game2] = await dbConn('games').insert(f.game({'result': 'loss'}));
        const [game3] = await dbConn('games').insert(f.game({'result': 'win'}));
        const [game4] = await dbConn('games').insert(f.game({'result': 'loss'}));
        const bet1 = dbConn('bets').insert(f.bet({'userId': userId, gameId: game1, 'option': 'win', 'amount': 100}));
        const bet2 = dbConn('bets').insert(f.bet({'userId': userId, gameId: game2, 'option': 'loss', 'amount': 500}));
        const bet3 = dbConn('bets').insert(f.bet({'userId': userId, gameId: game3, 'option': 'loss', 'amount': 300}));
        const bet4 = dbConn('bets').insert(f.bet({'userId': userId, gameId: game4, 'option': 'loss', 'amount': 400}));
        await Promise.all([bet1, bet2, bet3, bet4]);
        const stats = await user.getBetStats(userId);
        expect(stats).toStrictEqual({
            'betsMade': 4,
            'optionCounts': {
                'win': 1,
                'loss': 3
            },
            'winPercentage': 75,
            'earnings': 700
        })
    });

    test('Returns correctly if a user has no bets', async() => {
        const [userId] = await dbConn('users').insert(f.user({'username': 'snorlax', 'discordId': 'test9', 'points': 100}));
        const stats = await user.getBetStats(userId);
        expect(stats).toStrictEqual({
            'betsMade': 0,
            'optionCounts': {},
            'winPercentage': 0,
            'earnings': 0
        })
    })
});