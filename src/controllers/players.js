'use strict'

const { dbConn } = require('../../config/db.config');

/*
   Controller for dealing with DB Interactions with Players
   These functions all return promises to be executed when needed.
*/

function get(id) {
    try {
        const player = dbConn
            .select(['*'])
            .from('players')
            .where('id', '=', id)
        return player;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

function create(info) {
    let playerInfo = Object.assign({
        wins: 0,
        losses: 0,
        created_at: new Date(),
        updated_at: new Date(),
    }, info)
    try {
        const player = dbConn('players')
            .insert(playerInfo)
            .into('players')
            .returning('id')
            .then((player) => {
                return {id: player[0], ...playerInfo}
            })
        return player;
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

module.exports = {
    get,
    create
}