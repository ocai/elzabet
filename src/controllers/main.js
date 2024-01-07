'use strict'

const riot = require('../services/riot');
const game = require('./game');
const player = require('./player');
const bet = require('./bet');
const user = require('./user');
const message = require('../discord/helpers/bet/message');

async function processGames() {
    const players = await player.getAll();
    const activeGames = [];
    players.forEach((p) => {
        activeGames.push(riot.getActiveGameBySummoner(p.summonerName).then((res) => {
            return {
                'status': res.status,
                'data': {
                    'playerId': p.id,
                    'summonerName': p.summonerName,
                    'riotGameId': res.data['gameId']
                }
            }
        }))
    });
    const currentGames = await Promise.all(activeGames);
    currentGames.forEach((game) => {
        // Returns from this don't really matter, so we don't need to wait
        handleResponse(game.status, game.data)
    });

    return 0;
}

/**
 * 
 * @param {*} status status code the response from the Riot API active game endpoint
 * @param {*} data object containing riotGameId (null if none found), playerId
 * 
 * Returns a game object (newly created, updated, or current) if any are found
 * Returns null if a 404 is received with no in progress games
 */
async function handleResponse(status, data) {
    console.log(`handling response ${status}`)
    console.log('data: ', data);
    switch(status) {
        case 200:
            const newGame = await handleGame(data);
            return newGame;
        case 404:
            // Check if in progress game exists
            let currentGame = await game.get({'playerId': data['playerId'], 'status': 'in_progress'});
            if (currentGame) {
                console.log('currentGame: ', currentGame);
                let updated;
                try {
                    const res = await riot.getMatch(currentGame.riotMatchId);
                    const result = riot.extractResult(res, data['summonerName']);
                    updated = await game.update(currentGame.id, result);
                } catch (error) {
                    console.log('Error updating game result: ', error);
                    // TODO: Call function to undo/fix game state? Possibly after enough retires?
                    return updated;
                }

                try {
                    await resolveBets(updated);
                } catch(error) {
                    console.log('updated game: ', updated);
                    console.log('Error resolving bets: ', error);
                }
                try {
                    const resultMessage = await message.betResults(currentGame.id);
                    if (resultMessage)
                        message.sendMessage(resultMessage);
                    return updated;
                } catch (error) {
                    console.log('Error sending results: ', error);
                    return null;
                }
            } else {
                return null;
            }
        default:
            // 5xx Error - Does nothing
            console.log('Something went wrong.');
            console.log('status: ', status);
            console.log(`Error: ${res['statusText']}`);
            return null;
    }
}

/**
 * 
 * @param {*} currentGame game object
 * 
 * Updates bets with results
 * Updates users with new point amounts
 * Returns nothing
 */
async function resolveBets(currentGame) {
    const bets = await bet.updateByGame(currentGame.id, currentGame.result);
    bets.forEach(async (bet) => {
        if (bet.result == 'win') {
            const updated = await user.update(bet.userId, 2*parseInt(bet.amount));
            console.log('updated User: ', updated);
        }
            
    })
}

/**
 * 
 * @param {*} data Object containing playerId, riotGameId, summonerName
 * @returns a game object
 */
async function handleGame(data) {
    const gameData = {'playerId': data['playerId'], 'riotGameId': data['riotGameId']}
    // get game by id
    let currentGame = await game.get(gameData);

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
        await message.sendMessage(message.activeGame(data['summonerName']));
        return newGame;
    } else {
        if (currentGame.status == 'bettable') {
            const currentTime = new Date();
            const betLockoutTime = 200; // in seconds
            const secondsElapsed = (currentTime.getTime() - currentGame.createdAt.getTime()) / 1000;

            if (secondsElapsed > betLockoutTime) {
                currentGame = await game.updateStatus(currentGame.id, 'in_progress');
                console.log(`set game id: ${currentGame.id} to in_progress`);
                message.sendMessage(await message.betTable(currentGame.id));
            }
        }
        return currentGame;
    }
}

module.exports = { processGames, handleResponse }