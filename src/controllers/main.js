'use strict'

const riot = require('../services/riot');
// const discord = require('./discord');
const game = require('./game');
const player = require('./player');

async function processGames() {
    // TODO: Pull the list of 'players' from the DB and use it here
    const players = await player.getAll();

    players.forEach(async function (p) {
        try {
            const activeGame = await riot.getActiveGameBySummoner(p);
            console.log(p, "is in a game");

            const currentPlayer = await player.getBySummonerName(p);
            const info = {
                'playerId': currentPlayer.id,
                'riotGameId': activeGame.data.gameId
            }

            handleGame(info);
        } catch (error) {
            // console.log(error);
        }
    });

    return 0;
}

async function handleGame(data) {
    // get game by id
    let currentGame = await game.get(data);

    if (!currentGame) {
        const newGame = game.create({
            'playerId': data.playerId,
            'riotGameId': data.riotGameId,
            'riotMatchId': `NA1_${data.riotGameId}`,
            'status': 'bettable',
            'result': null,
            'createdAt': new Date(),
            'updatedAt': new Date()
        });
        return newGame;
    } else {
        if (currentGame.status == 'bettable') {
            const currentTime = new Date();
            const betLockoutTime = 200; // in seconds
            const secondsElapsed = (currentTime.getTime() - currentGame.createdAt.getTime()) / 1000;

            if (secondsElapsed > betLockoutTime) {
                await game.updateStatus(currentGame.id, 'in_progress');
                console.log(`set game id: ${currentGame.id} to in_progress`);
            }
        }
        return null;
    }
}

module.exports = { processGames }