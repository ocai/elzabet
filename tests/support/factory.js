'use strict'

function bet(params) {
    return Object.assign({
        'userId': 1,
        'gameId': 1,
        'playerId': 1,
        'option': 'win',
        'amount': 100,
        'result': null,
        'updatedAt': '2023-12-09 17:01:47',
        'createdAt': '2023-12-09 17:01:47'
    }, params)
}

function game(params) {
    return Object.assign({
        'playerId': 1,
        'riotGameId': 'test',
        'riotMatchId': 'NA1_test',
        'status': 'in_progress',
        'result': null,
        'updatedAt': '2023-12-09 17:01:47',
        'createdAt': '2023-12-09 17:01:47'
    }, params)
}

function player(params) {
    return Object.assign({
        'id': 1,
        'summonerName': 'tspin2Win',
        'riotId': 'test',
        'updatedAt': '2023-12-09 17:01:47',
        'createdAt': '2023-12-09 17:01:47'
    }, params)
}

function user(params) {
    return Object.assign({
        'username': 'test',
        'discordId': 'test',
        'points': 1000,
        'updatedAt': '2023-12-09 17:01:47',
        'createdAt': '2023-12-09 17:01:47'
    }, params)
}

module.exports = {
    bet, 
    game,
    player,
    user
}