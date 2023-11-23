/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
  await knex.raw(`CREATE TABLE elzabet.users (id VARCHAR(255), username VARCHAR(255), discord_id VARCHAR(255), points INTEGER, created_at DATETIME, udpated_at DATETIME)`);
  await knex.raw(`CREATE TABLE elzabet.players (id VARCHAR(255), summoner_name VARCHAR(255), riot_id VARCHAR(255), wins INTEGER, losses INTEGER, created_at DATETIME, udpated_at DATETIME)`);
  await knex.raw(`CREATE TABLE elzabet.games (id VARCHAR(255), opgg_link VARCHAR(255), result VARCHAR(10), created_at DATETIME, udpated_at DATETIME)`);
  await knex.raw(`CREATE TABLE elzabet.bets (id VARCHAR(255), user_id VARCHAR(255), player_id VARCHAR(255), game_id VARCHAR(255), amount INTEGER, bet_result VARCHAR(10), created_at DATETIME, udpated_at DATETIME)`)
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
  await knex.raw(`DROP TABLE elzabet.users`);
  await knex.raw(`DROP TABLE elzabet.players`);
  await knex.raw(`DROP TABLE elzabet.games`);
  await knex.raw(`DROP TABLE elzabet.bets`);
};
