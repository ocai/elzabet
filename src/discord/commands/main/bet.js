const { ComponentType, SlashCommandBuilder } = require('discord.js');
const components = require('../../components/bet');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('bet')
		.setDescription('Bet on a current player')
		.addIntegerOption(option =>
			option.setName('amount')
				.setDescription('The amount to bet')),
	async execute(interaction) {
		const amount = interaction.options.getInteger('amount');
		if (amount) {
			await interaction.reply({
				content: 'Place your bet!',
				ephemeral: true,
				components: [
					components.players,
					components.betOptions,
					components.confirmButton,
					components.cancelButton
				]
			});
		} else {
			const testBalance = 100;
			await interaction.reply({
				content: `Your current balance is ${testBalance}\n Type '/bet <amount>' to bet!\n EXAMPLE: /bet 100`,
				ephemeral: true
			})
		}
		

		// TODO: Collect choices and do stuff on confirm press
		// const collector = response.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 3_600_000 });
		// const responses = await collector.on('collect', async i => {
		// 	playerChoice = await i.values[0];
		// 	i.deferUpdate();
		// 	// return selection;
		// });
		// console.log('playerChoice: ', playerChoice)
		// console.log('responses: ', responses)
	},
};
