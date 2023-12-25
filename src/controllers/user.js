'user strict'

const { dbConn } = require('../../config/db.config');
const bets = require('./bet');

function create(info) {
    let userInfo = Object.assign({
        'username': null, // thinking this will be like `#snorlax_tspins`, the one that doesn't change (nicknames change too much)
        'discordId': null, // id of their discord user (identifier from API)
        'points': 1000, // optional, default to 1000 if not passed in
        'createdAt': new Date(),
        'updatedAt': new Date(),
    }, info)
    try {
        const user = dbConn('users')
            .insert(userInfo)
            .into('users')
            .then((user) => {
                return {id: user[0], ...userInfo}
            });
        return user;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

function get(id) {
    try {
        const user = dbConn
            .first(['*'])
            .from('users')
            .where('id', '=', id)
        return user;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

function getByDiscordId(discordId) {
    try {
        const user = dbConn
            .first(['*'])
            .from('users')
            .where('discordId', '=', discordId)
        return user;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

/**
 * 
 * @param {*} id: id of user
 * @returns {
*  'betsMade': <integer>,
*  'optionCounts': {
*      'win': <integer>,
*      'loss': <integer>
*   },
*   'winPercentage': <float>,
*   'earnings': <integer>,
* }
*/
function getBetStats(id) {
    try {
        const betStats = dbConn
                .select('bets.gameId', 'bets.option', 'games.result', 'bets.amount')
                .from('bets')
                .join('games', 'bets.gameId', '=', 'games.id')
                .where('bets.userId', '=', id)
                .then(async (response) => {
                    const user = await get(id);

                    if (user != undefined) {
                        const betsMade = response.length;

                        let options = {};
                        let earnings = 0;
                        let numWins = 0;

                        for (let i = 0; i < response.length; i++) {
                            const key = response[i].option;
                            options[key] = (options[key] || 0) + 1;

                            if (key == response[i].result) {
                                earnings += response[i].amount;
                                numWins++;
                            } else {
                                earnings -= response[i].amount;
                            }
                        }

                        const winPercentage = (numWins / betsMade * 100) || 0;

                        return {
                            'betsMade': betsMade,
                            'optionCounts': options,
                            'winPercentage': winPercentage,
                            'earnings': earnings
                        }
                    }
                });
        return betStats;        
    } catch (error) {
        console.error(`Error getting stats for user ${id}`, error);
    }    
}

/**
 * 
 * @param {*} id: id of the user 
 * @param {*} points: point change as integer
 * i.e. if user currently has 200 points, and 100 is passed in, the 
 * resulting points should be 300. 
 * @returns full updated user
 */
function update(id, points) { 
    try {
        const updateTime = new Date();
        const user = dbConn('users')
            .where('id', '=', id)
            .update('points', dbConn.raw(`points + ${points}`))
            .update('updatedAt', updateTime)
            .then(() => {
                const updatedUser = get(id).then((response) => {
                    return response;
                });
                return updatedUser;
            });
        return user;
    } catch (error) {
        console.error(
            `Error updating user ${id}'s points by ${points}`, error)
    }
}

/**
 * 
 * @param {*} points: point change as integer 
 * @returns None
 * This function should update the points of every user
 */
function updateAll(points) {
    try {
        const users = dbConn
            .select(['*'])
            .from('users')
            .update('points', dbConn.raw(`points + ${points}`))
        return users;
    } catch (error) {
        console.error(`Error updating all users by ${points} points`, error);
    }
}

module.exports = {
    create,
    get,
    getByDiscordId,
    getBetStats,
    update,
    updateAll
};