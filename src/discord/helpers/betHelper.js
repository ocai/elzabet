'use strict'

const game = require('../../controllers/game');
const player = require('../../controllers/player');


/**
 * Suite of functions to help with handling the /bet discord slash command
 */

// function getActivePlayers() {
//     const players = game.getInProgress()
//         .then((games) => {
//             let playerIdList = [];
//             games.forEach((game) => { playerIdList.push(player.get(game['playerId'])) });
//             return Promise.all(playerIdList);
//         })
//     return players;
// }

module.exports = {
    getActivePlayers
}