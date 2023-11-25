'use strict'

const axios = require('axios');

async function sendMessage(message) {
	const response = await axios.post(
		`https://discord.com/api/webhooks/${process.env.WEBHOOK_URL}?wait=true`,
        { "content": message }
	).then((res) => {
        return res;
    });

    return response;
};

module.exports = {
    sendMessage
}