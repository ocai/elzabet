// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {

  development: {
    client: 'mysql2',
    connection: {
      host: 'db',
      database: 'elzabet',
      port: 3306,
      user: 'root',
      password: 'test'
    },
    seeds: {
      directory: './seeds/dev'
    }
  },

  test: {
    client: 'mysql2',
    connection: {
      host: 'db',
      database: 'test',
      port: 3306,
      user: 'root',
      password: 'test'
    }
  }

  // TODO: PROD CONFIG

};
