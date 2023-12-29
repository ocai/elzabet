'use strict'

/**
 * Handles the interactions for the bet confirmation message
 */

const bet = require('../../controllers/bet');
const game = require('../../controllers/game');
const user = require('../../controllers/user');
const m = require('./bet/message');
const { table } = require('table');
const { inlineCode, codeBlock } = require('discord.js');

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

        // returns the 1st element that matches in the bettable games array
        const bettableGame = info['games'].find((x) => x['summonerName'] == playerChoice);

        if (playerChoice && betChoice) {
            // retrieve the latest game status since it may no longer be bettable
            const currentGame = await game.get({'id': bettableGame.id});

            if (currentGame.status == 'bettable') {
                console.log('creating the bet');

                // Create the bet
                bet.create({
                    'userId': info['user']['id'],
                    'gameId': bettableGame['id'],
                    'playerId': bettableGame['playerId'],
                    'option': betChoice,
                    'amount': info['amount']
                });

                // Deduct points from the user
                const updated = await user.update(info['user']['id'], info['amount']*-1);
                await confirmation.update(m.betConfirmation(info['amount'], playerChoice, betChoice, updated['points']));
            } else {
                // TODO return bets in a table here
                const bets = await bet.getByGame(bettableGame['id']);
                let data = [['#', 'User', 'Option', 'Amount']];
                let userIndex = 1;
                console.log(bets);
        
                for (let i = 0; i < bets.length; i++) {
                    const betUser = await user.get(bets[i].userId);
                    data.push([userIndex.toString(), betUser.username, bets[i].option, bets[i].amount]);
                    userIndex++;
                }
        
                await confirmation.update({content: `Sorry, the betting period has expired. Here are the list of bets:\n${codeBlock(table(data))}`, components: []})
            }
        } else {
            await confirmation.update({content: 'You did not select enough options. Please try again.', ephemeral: true, components: []})
        }
    } else if (confirmation.customId == 'cancel') {
        await confirmation.update({content: 'Understood. Cancelling the bet.', components: []})
    }
}

module.exports = { handleResponse }