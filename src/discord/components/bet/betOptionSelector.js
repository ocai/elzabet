'use strict'

const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js');

const options = [
    new StringSelectMenuOptionBuilder()
        .setLabel('Win')
        .setValue('win'),
    new StringSelectMenuOptionBuilder()
        .setLabel('Lose')
        .setValue('loss'),
]

const select = new StringSelectMenuBuilder()
    .setCustomId('betOptions')
    .setPlaceholder('Betting options')
    .addOptions(...options);

const betOptions = new ActionRowBuilder()
    .addComponents(select)

module.exports = { betOptions };
