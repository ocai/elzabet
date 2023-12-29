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
  await knex('players').insert([
    {
      id: 2, 
      summonerName: '1T1T1T1T1T1', // Tyler1
      riotId: 'fCKmTbSWUWkhFdA7ABnQ8yydw6dir2CS_Qc-VmBwOhPubLs',
      wins: 0,
      losses: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ])
  await knex('players').insert([
    {
      id: 3, 
      summonerName: 'Pobelter',
      riotId: 'HYpRKERoPWHepFHYcAXkDvEQLqeN9HjVzzvL4a0gMw',
      wins: 0,
      losses: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
  await knex('players').insert([
    {
      id: 4, 
      summonerName: 'Imaqtpie',
      riotId: 'k98rVT0SWM6YESiGtMtArJ4fRS7qgoknGRxHZfBQsgdcwiU',
      wins: 0,
      losses: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ]);
};