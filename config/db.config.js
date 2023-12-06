'use strict';

const options = require('../knexfile')

// console.log("DB CONFIG: ")
// console.log(process.env.NODE_ENV)
// console.log(options[process.env.NODE_ENV])
const dbConn = require('knex')(options[process.env.NODE_ENV] || options['development']);  

module.exports = { dbConn }