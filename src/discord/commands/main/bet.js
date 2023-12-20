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
		let response;
		const amount = interaction.options.getInteger('amount');
		if (amount) {
			response = await interaction.reply({
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

		// Collects 2 select menu interactions
		// TODO: Add logic to handle case where user changes their decision on the same select menu
		const collector = response.createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 3_600_000, max: 2 });
		collector.on('collect', async i => {
			const selection = i.values;
			await i.deferUpdate();
			return selection;
		});

		collector.on('end', async (collected) => {
			const responses = collected.map((menuInteraction) => {
				// console.log(menuInteraction);
				// console.log(menuInteraction.id);
				return menuInteraction.values[0];
			});
			console.log('responses: ', responses);
			const confirmation = await response.awaitMessageComponent({ time: 60000 });
			if (confirmation.customId === 'confirm') {
				await confirmation.update({ content: `Confirming your bet of ${amount} points for ${responses[0]} to ${responses[1]}.`, components: [] });
			} else if (confirmation.customId === 'cancel') {
				await confirmation.update({ content: 'Action cancelled', components: [] });
			}
		})
	},
};
