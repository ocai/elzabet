/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('bets').del()
  await knex('bets').insert([
    {
      userId: 1,
      gameId: 1,
      playerId: 1,
      option: 'win',
      amount: 100,
      result: null,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
};
