var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

require('dotenv').config()

const poll = require('./src/controllers/poll');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const router = require('./src/routes');
app.use(router);

// Initiate Game Polling
// TODO: Change this back to 2 min (this is just for testing currently)
var minutes = .1, the_interval = minutes * 60 * 1000;
setInterval(function() {
    console.log("Triggers every 2 min")
    poll.processGame("Elzisrad");
}, the_interval);

// Start the server 
const PORT=3000;
app.listen(PORT,() => { 
    console.log(`Running on PORT ${PORT}`); 
}) 

module.exports = app;
