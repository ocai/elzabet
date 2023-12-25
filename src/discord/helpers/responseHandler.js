'use strict'

/**
 * Handles the interactions for the bet confirmation message
 */

const bet = require('../../controllers/bet');
const user = require('../../controllers/user');
const m = require('./bet/message');

async function handleResponse(response, info = {}) {

    const collectionFilter = i => (i.user.id === i.user.id) && (i.isStringSelectMenu() || i.isButton());
    
    // Collects interactions until a button is pressed
    const collector = response.createMessageComponentCollector({ filter: collectionFilter, time: 9_000_000 });
    collector.on('collect', async i => {
        if (i.isStringSelectMenu()) {
            const selection = i.values;
            await i.deferUpdate();
            return selection;
        } else if (i.isButton()) {
            collector.stop();
        }
    });

    collector.on('end', async (collected) => {
        const confirmation = collected.last();
        // TODO Handle bet lockout time restriction here
        await handleConfirm(collected, info, confirmation);
    })
}

async function handleConfirm(collected, info, confirmation) {
    // Extract player and option choices from game info
    const playerChoices = info['games'].map((game) => { return game['summonerName']});
    const betChoices = ['win', 'lose'];
    if (confirmation.customId == 'confirm') {
        let playerChoice, betChoice, selected;
        for (const [_, interaction] of collected) {
            selected = interaction.values
            if (selected) {
                if (playerChoices.includes(selected[0]))
                    playerChoice = selected[0];
                if (betChoices.includes(selected[0]))
                    betChoice = selected[0];
            }
        }
        const game = info['games'].find((x) => x['summonerName'] == playerChoice);
        if (playerChoice && betChoice) {
            // Create the bet
            bet.create({
                'userId': info['user']['id'],
                'gameId': game['id'],
                'playerId': game['playerId'],
                'option': betChoice,
                'amount': info['amount']
            });
            // Deduct points from the user
            const updated = await user.update(info['user']['id'], info['amount']*-1);
            await confirmation.update(m.betConfirmation(info['amount'], playerChoice, betChoice, updated['points']));
        } else {
            await confirmation.update({content: 'You did not select enough options. Please try again.', ephemeral: true, components: []})
        }
    } else if (confirmation.customId == 'cancel') {
        await confirmation.update({content: 'Understood. Cancelling the bet.', components: []})
    }
    
}

module.exports = { handleResponse }