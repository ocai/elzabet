/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('games').del()
  await knex('games').insert([
    {
      playerId: 1,
      riotGameId: 'test',
      riotMatchId: 'NA1_test',
      status: 'in_progress',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
};
