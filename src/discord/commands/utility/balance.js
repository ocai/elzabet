const { SlashCommandBuilder } = require('discord.js');
const m = require('../../helpers/bet/message');
const handler = require('../../helpers/responseHandler');
const user = require('../../../controllers/user');
const game = require('../../../controllers/game');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('balance')
		.setDescription('Check your point balance'),
	async execute(interaction) {
		const betUser = await user.getByDiscordId(interaction['user']['id']) || await user.create({
			'username': interaction['user']['discriminator'],
			'discordId': interaction['user']['id']
		});
        interaction.reply(await m.balanceMessage(betUser['points']));
        // TODO Add a leaderboard maybe
	},
};
