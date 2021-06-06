const { Client, MessageAttachment, Collection, MessageEmbed } = require('discord.js');
const { PREFIX, TOKEN } = require('./config.json');
const bot = new Client({ disableMentions: 'everyone' });
const fs = require("fs");
const db = require('quick.db');

bot.commands = new Collection();
bot.aliases = new Collection();

["aliases", "commands"].forEach(x => bot[x] = new Collection());
["console", "command", "event"].forEach(x => require(`./handler/${x}`)(bot));

bot.categories = fs.readdirSync("./commands/");

["command"].forEach(handler => {
    require(`./handler/${handler}`)(bot);
});
bot.on('ready', () => {
    setInterval(() => {
        dbl.postStats(bot.guilds.cache.size);
    }, 1800000);
});

bot.on('message', async message => {
    let prefix;
    try {
        let fetched = await db.fetch(`prefix_${message.guild.id}`);
        if (fetched == null) {
            prefix = PREFIX
        } else {
            prefix = fetched
        }
    } catch (e) {
        console.log(e)
    };
    try {
        if (message.mentions.has(bot.user) && !message.mentions.has(message.guild.id)) {
            return message.channel.send(`**dawsh prefixam ine - \`${prefix}\`**`)
        }
    } catch {
        return;
    };
});
bot.login(TOKEN);