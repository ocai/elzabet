require('iconv-lite').encodingExists('foo')
const { dbConn } = require('../config/db.config');

// beforeAll(async () => {})

// Clean up test DB Tables after tests 
afterAll(async () => {
    await dbConn('bets').delete().truncate();
    await dbConn('games').delete().truncate();
    await dbConn('players').delete().truncate();
    await dbConn('users').delete().truncate();
})