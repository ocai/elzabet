'user strict'

/*
Bet creation restrictions:
  Reject bet creation if...
    - amount > users's point balance
    - game duration > 6 minutes
*/
function create(info) {
    let betInfo = Object.assign({
        'resolved': false,
        'createdAt': new Date(),
        'updatedAt': new Date(),
    }, info)
    try {
        const player = dbConn('bets')
            .insert(betInfo)
            .into('bets')
            .then((player) => {
                return {id: player[0], ...playerInfo}
            })
        return player;
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
function getByGame(gameId) {
    try {
        const bets = dbConn
            .select(['*'])
            .from('bets')
            .where('gameId', '=', gameId)
        return bets;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

// Return all bets a user has made on one game
function getUserBets(userId, gameId) {
    try {
        const bets = dbConn
            .select(['*'])
            .from('bets')
            .where('userId', '=', userId).andWhere('gameId', '=', gameId)
        return bets;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

function remove(id) {
    return 0;
}

module.exports = {
    create,
    getByPlayer,
    getUserBets,
    getByGame,
    updateByGame,
    remove
};