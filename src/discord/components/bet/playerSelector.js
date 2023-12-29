'use strict'

const games = require('../../../controllers/game');

const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');

async function players() {
    return await games.getAll({ 'status': 'bettable'}).then((res) => {
        let summonerNames = [];
        let options = [];
    
        for (const game of res) {
            if (!summonerNames.includes(game.summonerName)) { // only include unique players
                summonerNames.push(game.summonerName);
            }
        }
    
        for (const name of summonerNames) {
            options.push(new StringSelectMenuOptionBuilder()
                .setLabel(name)
                .setValue(name)
            );
        }
    
        const select = new StringSelectMenuBuilder()
            .setCustomId('players')
            .setPlaceholder('Pick a player to bet on!')
            .addOptions(...options);
    
        const players = new ActionRowBuilder()
            .addComponents(select)
        
        return players;
    });
}

module.exports = { players };