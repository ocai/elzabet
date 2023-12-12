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
		`${BASE_URL_V4}/spectator/v4/active-games/by-summoner/${encryptedId}?api_key=${process.env.RIOT_KEY}`
	);
	return promise;
};

function getActiveGameBySummoner(summonerName) {
	try {
		const promise = getSummonerInfo(summonerName)
			.then((response) => {
				let encryptedId = response.data.id;
				return getActiveGame(encryptedId)
			})
		return promise;
	} catch(err) {
		console.log(err.response.data)
		return err.response;
	}
}

function getMatch(matchId) {
	const promise = axios.get(`${BASE_URL_V5}/match/v5/matches/${matchId}?api_key=${process.env.RIOT_KEY}`)
		.then((res) => {
			return res;
		});
    return promise;
}

module.exports = {
	getActiveGameBySummoner,
	getMatch
}