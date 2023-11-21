var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./src/routes/index');
var usersRouter = require('./src/routes/users');

const riot = require('./src/services/riot')

var app = express();

require('dotenv').config()

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/test', function(req, res) { 
    const test = riot.getSummonerInfo('tspin2win');
    test.then((response) => {
        // console.log(response.data)
        res.json(response.data); 
    })
  }); 

// Initiate 
var minutes = 2, the_interval = minutes * 60 * 1000;
setInterval(function() {
    console.log("Triggers every 2 min")
    // TODO: Do the in-game check for summoners
}, the_interval);

// Start the server 
const PORT=3000;
app.listen(PORT,() => { 
    console.log(`Running on PORT ${PORT}`); 
}) 

module.exports = app;
