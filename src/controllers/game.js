'user strict'

const { dbConn } = require('../../config/db.config');

function create(info) {
    let gameInfo = Object.assign({
        'status': "in_progress",
        'result': null,
        'createdAt': new Date(),
        'updatedAt': new Date(),
    }, info)
    try {
        const game = dbConn('games')
            .insert(gameInfo)
            .into('games')
            .then((game) => {
                return {id: game[0], ...gameInfo}
            });
        return game;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

/**
 * 
 * @param {*} info {}
 * info is an object containing any combination of queryable fields 
 * @returns 
 * a single game
 */

function get(info) {
    let acceptedFields = [
        'id',
        'playerId',
        'riotGameId',
        'riotMatchId',
        'status',
        'result',
        // probably won't use these 2, but they're here
        'createdAt',
        'updatedAt'
    ]
    try {
        if ((Object.keys(info).length == 0) || (Object.keys(info).length > acceptedFields.length))
            throw Error("Invalid Object");
        const game = dbConn('games')
            .first(['*'])
            .from('games')
            .where((builder) => {
                for (const [key, value] of Object.entries(info)) {
                    if (acceptedFields.includes(key)) {
                        builder.where(key, value);
                    } else {
                        throw Error("Invalid Object")
                    }                   
                }
            })
        return game;
    } catch(error) {
        console.log("Something went wrong", error);
    }
}

/**
 * 
 * @param {*} playerId 
 * @param {*} result (win | loss)
 * @returns 
 */
function update(playerId, result) { 
    return 0
}

module.exports = {
    create,
    get,
    update
};