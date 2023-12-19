const { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle } = require('discord.js');

/**
 * Was considering a modal, but there is very limited functionality for Discord modals at the moment
 * Going to leave this here for now as an example, but this won't be used, 
 */

const modal = new ModalBuilder()
    .setCustomId('myModal')
    .setTitle('My Modal');

// Add components to modal

// Create the text input components
const favoriteColorInput = new TextInputBuilder()
    .setCustomId('favoriteColorInput')
    // The label is the prompt the user sees for this input
    .setLabel("What's your favorite color?")
    // Short means only a single line of text
    .setStyle(TextInputStyle.Short);

const hobbiesInput = new TextInputBuilder()
    .setCustomId('hobbiesInput')
    .setLabel("What's some of your favorite hobbies?")
    // Paragraph means multiple lines of text.
    .setStyle(TextInputStyle.Paragraph);

// An action row only holds one text input,
// so you need one action row per text input.
const firstActionRow = new ActionRowBuilder().addComponents(favoriteColorInput);
const secondActionRow = new ActionRowBuilder().addComponents(hobbiesInput);

// Add inputs to the modal
modal.addComponents(firstActionRow, secondActionRow);

module.exports = { modal }