'user strict'

const { dbConn } = require('../../config/db.config');
const user = require('../controllers/user');
const player = require('../controllers/player');
const game = require('../controllers/game');

/*
Bet creation restrictions:
  Reject bet creation if...
    - amount > users's point balance
    - game duration > 6 minutes
*/
function create(info) {
    let betInfo = Object.assign({
        'result': null,
        'createdAt': new Date(),
        'updatedAt': new Date(),
    }, info)
    try {
        const bet = dbConn('bets')
            .insert(betInfo)
            .into('bets')
            .then((bet) => {
                return { 'id': bet[0], ...betInfo }
            });
        return bet;
    } catch (error) {
        console.error('Error creating bet:', error);
    }
}

// Should return list of bets for a player
function getByPlayer(playerId) {
    try {
        const bets = dbConn
            .select(['*'])
            .from('bets')
            .where('playerId', '=', playerId)
            .then((bets) => { return preloadAll(bets); })
        return bets;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

// List of bets for a particular game
function getByGame(gameId) {
    try {
        const bets = dbConn
            .select(['*'])
            .from('bets')
            .where('gameId', '=', gameId)
            .then((bets) => { return preloadAll(bets); })
        return bets;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

// Return all bets a user has made
function getByUser(userId) {
    try {
        const bets = dbConn
            .select(['*'])
            .from('bets')
            .where('userId', '=', userId)
            .then((bets) => { return preloadAll(bets); })
        return bets;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

// Resolve bets pertaining to a game id
function updateByGame(gameId, result) {
    try {
        const res = getByGame(gameId, 'id').then((bets) => {
            const betIds = bets.map((obj => { return obj['id'] }))
            const wins = dbConn('bets')
                .whereIn('id', betIds).andWhere('option', '=', result)
                .update({
                    'result': 'win',
                    'updatedAt': new Date()
                })
            const losses = dbConn('bets')
                .whereIn('id', betIds).and.whereNot('option', '=', result)
                .update({
                    'result': 'loss',
                    'updatedAt': new Date()
                })
            return Promise.all([wins, losses]).then(async (res) => {
                return await getByGame(gameId);
            });
        })
        return res;
    } catch (error) {
        console.error(`Error updating gameId ${gameId} with result ${result}`, error);
    }
}

async function preloadAll(bets) {
    return Promise.all(bets.map(async (bet) => {
        let objects = await preload(bet);
        return Object.assign(bet, objects);
    }))
}

async function preload(bet) {
    const objects = [
        user.get(bet.userId),
        player.get(bet.playerId),
        game.get({'id': bet.gameId})
    ];
    const resolved = await Promise.all(objects);
    return {
        'user': resolved[0],
        'player': resolved[1],
        'game': resolved[2]
    }
}

module.exports = {
    create,
    getByPlayer,
    getByUser,
    getByGame,
    updateByGame,
    // calculateUserStats,
};