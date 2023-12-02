'use strict'

const riot = require('../services/riot');
const discord = require('./discord');

function processGame(playerName) {
    const game = riot.getActiveGameBySummoner(playerName);
    game.then((response) => {
        if ((response.status == 200) && (response.data.gameId)) {
            console.log(response.data)
            // Create a 'game' in the DB with this id
            discord.sendMessage("ElzisRad is in a game: https://www.op.gg/summoners/na/ElzIsRad-NA1/ingame")
        }
    })
}

module.exports = { processGame }