const { PREFIX } = require('../../config.json');
module.exports = async(client) => {
    console.log(`[API] Logged in as ${client.user.username}`);
    await client.user.setActivity("pedaret", {
        type: "WATCHING", //can be LISTENING, WATCHING, PLAYING, STREAMING
    });
};