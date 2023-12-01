// import axios from 'axios';
const axios = require('axios');

const getSummonerInfo = async (name) => {
	const response = await axios.get(
		`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}?api_key=${process.env.RIOT_KEY}`
	);
    return response;
};

const getActiveGame = async (encryptedId) => {
	const response = await axios.get(
		`https://na1.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/${encryptedId}?api_key=${process.env.RIOT_KEY}`
	);
	return response;
};

const getActiveGameBySummoner = async (summonerName) => {
	try {
		const response = await getSummonerInfo(summonerName)
			.then((response) => {
				let encryptedId = response.data.id;
				return getActiveGame(encryptedId)
			})
	return response;
	} catch(err) {
		console.log(err.response.data)
		return err.response;
	}
}

module.exports = {
    getSummonerInfo,
	getActiveGameBySummoner
}