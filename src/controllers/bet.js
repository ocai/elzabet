'user strict'

const { dbConn } = require('../../config/db.config');

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
        return bets;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

// List of bets for a particular game
function getByGame(gameId, selectQuery = '*') {
    try {
        const bets = dbConn
            .select([selectQuery])
            .from('bets')
            .where('gameId', '=', gameId)
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
        return bets;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

// TODO
// function calculateUserStats(userId) {
//     return getUserBets(userId)
//         .then((bets) => {
//             let optionStats = {};
//             let winPercentage;
//         })
// }

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
            return Promise.all([wins, losses]);
        })
        return res;
    } catch (error) {
        console.error(`Error updating gameId ${gameId} with result ${result}`, error);
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