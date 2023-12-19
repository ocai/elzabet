'use strict'

const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');

const options = [
    new StringSelectMenuOptionBuilder()
        .setLabel('ElzisRad')
        .setValue('ElzisRad'),
    new StringSelectMenuOptionBuilder()
        .setLabel('L0Liver')
        .setValue('L0liver'),
]

const select = new StringSelectMenuBuilder()
    .setCustomId('players')
    .setPlaceholder('Pick a player to bet on!')
    .addOptions(...options);

const players = new ActionRowBuilder()
    .addComponents(select)

module.exports = { players };
