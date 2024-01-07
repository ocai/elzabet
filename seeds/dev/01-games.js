/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Deletes ALL existing entries
  await knex('games').del()
  await knex('games').insert([
    // {
    //   playerId: 1,
    //   riotGameId: 'test1',
    //   riotMatchId: 'NA1_test1',
    //   status: 'bettable',
    //   createdAt: new Date(),
    //   updatedAt: new Date()
    // },
    // {
    //   playerId: 2,
    //   riotGameId: 'test2',
    //   riotMatchId: 'NA1_test2',
    //   status: 'in_progress',
    //   createdAt: new Date(),
    //   updatedAt: new Date()
    // },
    {
      playerId: 3,
      riotGameId: 'test3',
      riotMatchId: 'NA1_test3',
      status: 'final',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
};
