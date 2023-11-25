'use strict';

const DB_NAME = process.env.DB_NAME;
const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_HOST = process.env.DB_HOST;

const dbConn = require('knex')({
    client: 'mysql2',
    connection: {
      host : DB_HOST,
      port : 3306,
      user : DB_USER,
      password : DB_PASS,
      database : DB_NAME
    },
    pool: { min: 0, max: 7 }
  });
  

module.exports = { dbConn }