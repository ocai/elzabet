'user strict'

const { dbConn } = require('../../config/db.config');
const player = require('../controllers/player');

/**
 * 
 * @param {*} info {}
 * info is an object containing fields needed to create a game (playerId, riotGameId, riotMatchId)
 * @returns 
 * the created game
 */
function create(info) {
    let gameInfo = Object.assign({
        'playerId': null,
        'riotGameId': null,
        'riotMatchId': null,
        'status': 'bettable',
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
        console.error(error);
        throw(error);
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
    const acceptedFields = [
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
                        console.log(`Invalid key: ${key}`);
                        throw Error("Invalid Object")
                    }                   
                }
            })
        return game;
    } catch(error) {
        console.log("Something went wrong", error);
        throw(error);
    }
}

/**
 * 
 * @param {*} info {}
 * info is an object containing any combination of queryable fields 
 * @returns 
 * all games that match
 */
function getAll(info) {
    const acceptedFields = [
        'id',
        'playerId',
        'riotGameId',
        'riotMatchId',
        'status',
        'result',
        'summonerName',
        // probably won't use these 2, but they're here
        'createdAt',
        'updatedAt'
    ]
    try {
        if ((Object.keys(info).length == 0) || (Object.keys(info).length > acceptedFields.length))
            throw Error("Invalid Object");
        const games = dbConn('games')
            .select('games.*', 'players.summonerName', 'players.riotId', 'players.wins', 'players.losses')
            .from('games')
            .join('players', 'games.playerId', '=', 'players.id')
            .where((builder) => {
                for (const [key, value] of Object.entries(info)) {
                    if (acceptedFields.includes(key)) {
                        builder.where(key, value);
                    } else {
                        console.log(`Invalid key: ${key}`);
                        throw Error("Invalid Object")
                    }                   
                }                
            })
        return games;
    } catch(error) {
        console.log("Something went wrong", error);
        throw(error);
    }
}

/**
 * 
 * @param {*} id: id of the game 
 * @param {*} result (win | loss)
 * @returns
 * the game that was updated
 */
function update(id, result) { 
    const acceptedResults = ['win', 'loss'];
    try {
        if (!acceptedResults.includes(result)) {
            console.log('in here')
            throw Error(`Invalid result: ${result}`);
        } else {
            const game = dbConn('games')
                .where('id', '=', id).andWhere(function () {
                    this.where('status', '=', 'bettable').orWhere('status', '=', 'in_progress')
                })
                .update({
                    'result': result,
                    'status': 'final',
                    'updatedAt': new Date()
                })
                .then((res) => {
                    if (!res) {
                        console.log(`Invalid Query for game with id ${id}`)
                        throw Error(`Invalid Query for game with id ${id}`);
                    }
                    const updatedGame = get({'id': id}).then((response) => {
                        return response;
                    });
                    return updatedGame;
                })
            return game;
        }
    } catch (error) {
        console.log("Something went wrong: ", error)
        throw(error);
    }
}

/**
 * 
 * @param {*} id: id of the game 
 * @param {*} status (bettable | in_progress | final)
 * @returns
 * the game that was updated
 */
function updateStatus(id, status) {
    const acceptedStatuses = ['bettable', 'in_progress', 'final'];    
    try {
        if (!acceptedStatuses.includes(status)) {
            console.log('in here')
            throw Error(`Invalid status: ${status}`);
        } else {
            const game = dbConn('games')
            .where('id', '=', id)
            .update({
                'status': status,
                'updatedAt': new Date()
            })
            .then((res) => {
                if (!res) {
                    console.log(`Invalid Query for game with id ${id}`)
                    throw Error(`Invalid Query for game with id ${id}`);
                }
                const updatedGame = get({'id': id}).then((response) => {
                    return response;
                });
                return updatedGame;
            })
            return game;
        }
    } catch (error) {
        console.log("Something went wrong: ", error)
        throw(error);
    }
}

function getWithPlayer(id) {
    try {
        const game = dbConn
            .first(['*'])
            .from('games')
            .where('id', '=', id)
            .then(async (game) => { return Object.assign(game, {'player': await player.get(game.playerId)}); })
        return game;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

async function preloadPlayer(game) {
    
}

module.exports = {
    create,
    get,
    getAll,
    getWithPlayer,
    update,
    updateStatus
};