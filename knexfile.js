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
  }

  // staging: {
  //   client: 'mysql2',
  //   connection: {
  //     database: 'elzabet',
  //     user:     'root',
  //     password: 'test'
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10
  //   },
  //   migrations: {
  //     tableName: 'knex_migrations'
  //   }
  // },

  // production: {
  //   client: 'mysql2',
  //   connection: {
  //     database: 'elzabet',
  //     user:     'root',
  //     password: 'test'
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10
  //   },
  //   migrations: {
  //     tableName: 'knex_migrations'
  //   }
  // }

};
