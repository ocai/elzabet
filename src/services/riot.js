// import axios from 'axios';
const axios = require('axios');
const BASE_URL_V4 = "https://na1.api.riotgames.com/lol";
const BASE_URL_V5 = "https://americas.api.riotgames.com/lol"

function getSummonerInfo(name) {
	const promise = axios.get(
		`${BASE_URL_V4}/summoner/v4/summoners/by-name/${name}?api_key=${process.env.RIOT_KEY}`
	);
    return promise;
};

function getActiveGame(encryptedId) {
	const promise = axios.get(
		`${BASE_URL_V4}/spectator/v4/active-games/by-summoner/${encryptedId}?api_key=${process.env.RIOT_KEY}`,
		{ validateStatus: false }
	);
	return promise;
};

function getActiveGameBySummoner(summonerName) {
	try {
		console.log('getSummonerInfo: ', summonerName);
		const promise = getSummonerInfo(summonerName)
			.then((response) => {
				let encryptedId = response.data.id;
				console.log('getActiveGame: ', encryptedId);
				return getActiveGame(encryptedId)
			})
		return promise;
	} catch(err) {
		console.log(err.response.data)
		return err.response;
	}
}

function getMatch(matchId) {
	console.log('getMatch: ', matchId);
	const promise = axios.get(`${BASE_URL_V5}/match/v5/matches/${matchId}?api_key=${process.env.RIOT_KEY}`)
		.then((res) => {
			return res;
		});
    return promise;
}

function extractResult(matchResponse, summoner) {
    let result;
    if (matchResponse.status == 200) {
		const participants = matchResponse.data.info.participants;
		participants.forEach((player) => {
			if (player.summonerName == summoner) {
                result = player.win ? 'win' : 'loss'
            }	
		})
        return result;
	} else {
		return null;
	}	
}

module.exports = {
	getActiveGameBySummoner,
	getMatch,
	extractResult
}