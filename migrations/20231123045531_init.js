/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = function(knex) {
  return knex.schema
    .createTable('users', function (table) {
      table.increments('id');
      table.string('username').notNullable();
      table.string('discordId').unique().notNullable();
      table.integer('points');
      table.dateTime('createdAt', new Date());
      table.dateTime('updatedAt', new Date());
    })
    .createTable('players', function (table) {
      table.increments('id');
      table.string('summonerName').unique().notNullable();
      table.string('riotId').unique().notNullable();
      table.integer('wins');
      table.integer('losses');
      table.dateTime('createdAt', new Date());
      table.dateTime('updatedAt', new Date());
    })
    .createTable('games', function(table) {
      table.increments('id');
      table.integer('playerId').notNullable();
      table.string('riotGameId').notNullable();
      table.string('riotMatchId').notNullable();
      table.string('status').notNullable();
      table.string('result');
      table.dateTime('createdAt', new Date());
      table.dateTime('updatedAt', new Date());
    })
    .createTable('bets', function(table) {
      table.increments('id');
      table.integer('userId').notNullable();
      table.integer('gameId').notNullable();
      table.integer('playerId').notNullable();
      table.string('option').notNullable();
      table.integer('amount').notNullable();
      table.string('result');
      table.dateTime('createdAt', new Date());
      table.dateTime('updatedAt', new Date());
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTable("users")
    .dropTable("players")
    .dropTable("games")
    .dropTable("bets");
};
