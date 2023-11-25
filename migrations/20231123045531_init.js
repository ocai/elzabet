/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */

exports.up = function(knex) {
  return knex.schema
    .createTable('users', function (table) {
      table.increments('id');
      table.string('username').notNullable();
      table.string('discord_id');
      table.integer('points', 100);
      table.dateTime('created_at', new Date());
      table.dateTime('updated_at', new Date());
    })
    .createTable('players', function (table) {
      table.increments('id');
      table.string('summoner_name').notNullable();
      table.string('riot_id').notNullable();
      table.integer('wins', 0);
      table.integer('losses', 0);
      table.dateTime('created_at', new Date());
      table.dateTime('updated_at', new Date());
    });
  // await knex.raw(`CREATE TABLE elzabet.users (id VARCHAR(255), username VARCHAR(255), discord_id VARCHAR(255), points INTEGER, created_at DATETIME, udpated_at DATETIME)`);
  // await knex.raw(`CREATE TABLE elzabet.players (id VARCHAR(255), summoner_name VARCHAR(255), riot_id VARCHAR(255), wins INTEGER, losses INTEGER, created_at DATETIME, udpated_at DATETIME)`);
  // await knex.raw(`CREATE TABLE elzabet.games (id VARCHAR(255), opgg_link VARCHAR(255), result VARCHAR(10), created_at DATETIME, udpated_at DATETIME)`);
  // await knex.raw(`CREATE TABLE elzabet.bets (id VARCHAR(255), user_id VARCHAR(255), player_id VARCHAR(255), game_id VARCHAR(255), amount INTEGER, bet_result VARCHAR(10), created_at DATETIME, udpated_at DATETIME)`)
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema
    .dropTable("users")
    .dropTable("players");
  // await knex.raw(`DROP TABLE elzabet.users`);
  // await knex.raw(`DROP TABLE elzabet.players`);
  // await knex.raw(`DROP TABLE elzabet.games`);
  // await knex.raw(`DROP TABLE elzabet.bets`);
};
