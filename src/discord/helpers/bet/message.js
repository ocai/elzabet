'use strict'

const components = require('../../components/bet');
const axios = require('axios');
const bet = require('../../../controllers/bet');
const game = require('../../../controllers/game');
// const { table } = require('table');
const { codeBlock } = require('discord.js');

function activeGame(player) {
    return {
        content: `${player} is in a game! Type \`/bet\` to bet on their game!\n \
        https://www.op.gg/summoners/na/${player}-NA1/ingame
        `,
        components: []
    }
}

function noActiveGames() {
    return {
        content: 'No active games were found. Please try again.',
        ephemeral: true
    }
}

async function betMessage(amount) {
    return {
        content: `Betting ${amount} points. Place your bet!`,
        ephemeral: true,
        components: [
            await components.players(),
            components.betOptions,
            components.confirmButton,
            components.cancelButton
        ]
    }
}

function balanceMessage(balance) {
    return {
        content: `Your current balance is \`${balance}\` points\n Type \`/bet <amount>\` to bet!\n EXAMPLE: \`/bet 100\``,
        ephemeral: true
    }
}

function exceedsBalance(amount, balance) {
    return {
        content: `A betting amount of ${amount} points exceeds your current balance of ${balance} points.\nPlease try again.`,
        ephemeral: true
    }
}

function betConfirmation(amount, player, option, balance) {
    const map = {
        'win': 'win',
        'loss': 'lose'
    }
    return {
        content: `Confirming your bet of ${amount} on ${player} to ${map[option]}.\n Your new point balance is ${balance}.`,
        ephemeral: true,
        components: []
    }
}

async function betTable(gameId) {
    const bets = await bet.getByGame(gameId);
    const betGame = await game.getWithPlayer(gameId);
    const betPlayer = betGame.player;
    if (bets.length < 1) {
        return {
            content: `The betting period for ${betPlayer.summonerName} has expired.`,
            components: []
        }
    }

    let str = "";

    bets.forEach((betObj) => {
        str += `${betObj.user.username} bets ${betObj.amount} points for ${betPlayer.summonerName} to ${betObj.option == 'win' ? 'win' : 'lose'}\n`;  
    });

    return {
        content: `Bets are in for ${betPlayer.summonerName}'s game:\n${codeBlock(str.trimEnd())}`, 
        components: []
    }
}

async function betResults(gameId) {
    const bets = await bet.getByGame(gameId);
    const betGame = await game.getWithPlayer(gameId);
    if (bets.length < 1)
        return null;
    let str = "";

    bets.forEach((betObj) => {
        str += `${betObj.user.username} bet ${betObj.amount} points and ${betObj.result == 'win' ? 'won' : 'lost'}!\n`;  
    })

    return {
        content: `${betGame.player.summonerName} has ${betGame.result == 'win' ? 'won' : 'lost'}!\n${codeBlock(str.trimEnd())}`, 
        components: []
    }
}

/**
 * 
 * @param {*} message: A structured Discord Message object
 * @returns 
 * 
 * This is used for just sending messages to the server that do not
 * need to be interacted with directly.
 */
async function sendMessage(message) {
	const response = await axios.post(
		`https://discord.com/api/webhooks/${process.env.WEBHOOK_URL}?wait=true`,
        message
	).then((res) => {
        return res;
    });

    return response;
};

module.exports = {
    activeGame,
    balanceMessage,
    betConfirmation,
    betMessage,
    betResults,
    betTable,
    exceedsBalance,
    noActiveGames,
    sendMessage
}