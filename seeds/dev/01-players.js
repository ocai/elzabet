/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('players').del()
  await knex('players').insert([
    {
      id: 1, 
      summonerName: 'ElzisRad',
      riotId: 'EL4AyQy_bgCXOmtfRXE_q9vqQGy8IcDS03Lg_yWU0u2NcuY',
      wins: 0,
      losses: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
};
