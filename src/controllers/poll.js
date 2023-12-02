'use strict'

const riot = require('../services/riot');
const discord = require('./discord');
const game = require('./game');

function processGames() {
    // TODO: Pull the list of 'players' from the DB and use it here
    const activeGame = riot.getActiveGameBySummoner("ElzisRad");
    activeGame.then((response) => {
        // Player is in a game
        if ((response.status == 200) && (response.data.gameId)) {
            console.log(response.data)
            // TODO: Create a 'game' in the DB with this id
            // handleGame(response.data)
            discord.sendMessage("ElzisRad is in a game: https://www.op.gg/summoners/na/ElzIsRad-NA1/ingame")
        // Player is not in a game
        } else {
            let inProgressGame = game.getInProgress("ElzisRad");
            // Game is finished
            // if (inProgressGame) {
                // let res = riot.getMatch(inProgressGame.id)
                // TODO: Update game
                // TODO: Get bets, resolve bets
                // TODO: Send game end discord message
            // }
        }
    })
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