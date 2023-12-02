'use strict'

const riot = require('../services/riot');
const discord = require('./discord');
const game = require('./game');

function processGames() {
    // TODO: Pull the list of 'players' from the DB and use it here
    const game = riot.getActiveGameBySummoner("ElzisRad");
    game.then((response) => {
        if ((response.status == 200) && (response.data.gameId)) {
            console.log(response.data)
            // TODO: Create a 'game' in the DB with this id
            // handleGame(response.data)
            discord.sendMessage("ElzisRad is in a game: https://www.op.gg/summoners/na/ElzIsRad-NA1/ingame")
        }
    })
}

function handleGame(data) {
    // get game by id
    let game = game.get(data.id);
    if (!game) {
        game.create({
            'playerId': data.playerId,
            'riotGameId': data.id,
            'riotMatchId': `NA1_${data.id}`,
            'status': 'in_progress',
            'result': null,
            'createdAt': new Date(),
            'updatedAt': new Date()
        });
    }
    return;
}

module.exports = { processGames }