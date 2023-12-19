'use strict'

const { ButtonBuilder , ActionRowBuilder } = require('discord.js');

const button = new ButtonBuilder()
    .setCustomId('confirm')
    .setLabel('CONFIRM')
    .setStyle('Success');

const confirmButton = new ActionRowBuilder()
    .addComponents(button);

module.exports = { confirmButton }