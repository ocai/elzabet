'use strict'

const { ButtonBuilder , ActionRowBuilder } = require('discord.js');

const button = new ButtonBuilder()
    .setCustomId('cancel')
    .setLabel('CANCEL')
    .setStyle('Danger');

const cancelButton = new ActionRowBuilder()
    .addComponents(button);

module.exports = { cancelButton }