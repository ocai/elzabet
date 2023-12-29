'use strict'

const components = require('../../components/bet');
const axios = require('axios');
// const 

function activeGame(player) {
    return {
        content: `${player} is in a game! \n \
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
    return {
        content: `Confirming your bet of ${amount} on ${player} to ${option}.\n Your new point balance is ${balance}.`,
        ephemeral: true,
        components: []
    }
}

function betTable() {
    return {
        content: `test bet table`,
        ephemeral: true
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
    betTable,
    exceedsBalance,
    noActiveGames,
    sendMessage
}