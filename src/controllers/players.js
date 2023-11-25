'use strict'

const { dbConn } = require('../../config/db.config');
// const knex = require('knex');
  
async function get(id) {
    try {
        const player = dbConn
        .select(['*'])
        .from('users')
        .where('id', '=', id)
        .returning('*')
        // .then((res) => {
        //     res;
        // })
        console.log('Connection has been established successfully.');
        return player;
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
}

module.exports = {
    get
}