var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const riot = require('./src/services/riot');
const discord = require('./src/controllers/discord');

var app = express();

require('dotenv').config()

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const router = require('./src/routes');
app.use(router);

// Initiate 
var minutes = 2, the_interval = minutes * 60 * 1000;
setInterval(function() {
    console.log("Triggers every 2 min")
    const game = riot.getActiveGameBySummoner("ElzisRad");
    game.then((response) => {
        if ((response.status == 200) && (response.data.gameId)) {
            discord.sendMessage("ElzisRad is in a game: https://www.op.gg/summoners/na/ElzIsRad-NA1/ingame")
        }
    })
}, the_interval);

// Start the server 
const PORT=3000;
app.listen(PORT,() => { 
    console.log(`Running on PORT ${PORT}`); 
}) 

module.exports = app;
