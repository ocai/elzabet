const { SlashCommandBuilder } = require('discord.js');
const m = require('../../helpers/bet/message');
const handler = require('../../helpers/responseHandler');
const user = require('../../../controllers/user');
const game = require('../../../controllers/game');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bet')
		.setDescription('Bet on a current player')
		.addIntegerOption(option =>
			option.setName('amount')
				.setDescription('The amount to bet')),
	async execute(interaction) {
		let response;
		const amount = interaction.options.getInteger('amount');
		const betUser = await user.getByDiscordId(interaction['user']['id']) || await user.create({
			'username': interaction['user']['username'],
			'discordId': interaction['user']['id']
		});
		if (!amount) {
			const balance = betUser['points']
			await interaction.reply(m.balanceMessage(balance));
		} else if (amount <= betUser['points']) {
			response = await interaction.reply(await m.betMessage(amount));
			info = {
				'amount': amount,
				'games': await game.getAll({ 'status': 'in_progress'}),
				'user': betUser
			}
			handler.handleResponse(response, info)
		} else if (amount > betUser['points']) {
			await interaction.reply(m.exceedsBalance(amount, betUser['points']));
		}
	},
};
