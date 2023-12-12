'use strict'

const riot = require('../services/riot');
const discord = require('./discord');
const game = require('./game');
const player = require('./player');

function processGames() {
    // TODO: Pull the list of 'players' from the DB and use it here
    // const activeGame = riot.getActiveGameBySummoner("ElzisRad");
    return 0;
}

function handleGame(data) {
    // get game by id
    let game = game.get(data.id);
    if (!game) {
        const newGame = game.create({
            'playerId': data.playerId,
            'riotGameId': data.id,
            'riotMatchId': `NA1_${data.id}`,
            'status': 'in_progress',
            'result': null,
            'createdAt': new Date(),
            'updatedAt': new Date()
        });
        return newGame;
    } else {
        return null;
    }
}

module.exports = { processGames }