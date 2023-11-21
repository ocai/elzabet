// import axios from 'axios';
const axios = require('axios');

const getSummonerInfo = async (name) => {
	const response = await axios.get(
		`https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/${name}?api_key=${process.env.RIOT_KEY}`
	);
    return response;
};

module.exports = {
    getSummonerInfo
}