'use strict'

function bet(params) {
    return Object.assign({
        'userId': 1,
        'gameId': 1,
        'playerId': 1,
        'option': 'win',
        'amount': 100,
        'result': null,
    }, params)
}

function game(params) {
    return Object.assign({
        'playerId': 1,
        'riotGameId': 'test',
        'riotMatchId': 'NA1_test',
        'status': 'in_progress',
        'result': null
    }, params)
}

function player(params) {
    return Object.assign({
        'id': 1,
        'summonerName': 'tspin2Win',
        'riotId': 'test'
    }, params)
}

function user(params) {
    return Object.assign({
        'username': 'test',
        'discordId': 'test',
        'points': 1000
    }, params)
}

module.exports = {
    bet, 
    game,
    player,
    user
}