'use strict'

// https://jestjs.io/docs/manual-mocks

function getActiveGameBySummoner(param) {
    if (param == 'test404') {
        const res = require('../../../tests/support/sample_responses/riot/not_found.json');
        return Promise.resolve({ 'status': 404, 'data': res })
    } else {
        const game = require('../../../tests/support/sample_responses/riot/active_game.json');
        return Promise.resolve({ 'status': 200, 'data': game });
    }
}

function getMatch(param) {
    if (param == 'test404') {
        const res = require('../../../tests/support/sample_responses/riot/not_found.json');
        return Promise.resolve({ 'status': 404, 'data': res })
    } else {
        const match = require('../../../tests/support/sample_responses/riot/match_details.json');
        return Promise.resolve({ 'status': 200, 'data': match });
    }
    
}

module.exports = {
	getActiveGameBySummoner,
	getMatch
}