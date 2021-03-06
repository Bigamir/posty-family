const { MessageEmbed } = require("discord.js");
const { readdirSync } = require("fs");
const db = require('quick.db');
const { stripIndents } = require("common-tags");
const { cyan } = require("../../JSON/colours.json");
const { PREFIX } = require('../../config.json');

module.exports = {
        config: {
            name: "help",
            aliases: ["h"],
            usage: "[command name] (optional)",
            category: "info",
            description: "tamam cmd haye bot ro mitoni ba in cmd bebini",
            accessableby: "everyone"
        },
        run: async(bot, message, args) => {
                let prefix;
                let fetched = await db.fetch(`prefix_${message.guild.id}`);

                if (fetched === null) {
                    prefix = PREFIX
                } else {
                    prefix = fetched
                }

                const embed = new MessageEmbed()
                    .setColor(cyan)
                    .setAuthor(`${message.guild.me.displayName} Help`, message.guild.iconURL())
                    .setThumbnail(bot.user.displayAvatarURL())

                if (!args[0]) {

                    const sembed = new MessageEmbed()
                        .setAuthor(`${message.guild.me.displayName}`, message.guild.iconURL())
                        .setColor("GREEN")
                        .setDescription('**dawsh dm to bebin!**')
                    message.channel.send(sembed).then(msg => {
                        msg.delete({ timeout: 10000 });
                    })

                    const categories = readdirSync("./commands/")

                    embed.setDescription(`**These Are the Available Commands For ${message.guild.me.displayName}\nBot's Global Prefix Is \`${PREFIX}\`\nServer Prefix Is \`${prefix}\`\n\nFor Help Related To A Particular Command Type -\n\`${prefix}help [command name | alias]\`**`)
                    embed.setFooter(`${message.guild.me.displayName} | Total Commands - ${bot.commands.size - 1}`, bot.user.displayAvatarURL());

                    categories.forEach(category => {
                        const dir = bot.commands.filter(c => c.config.category === category)
                        const capitalise = category.slice(0, 1).toUpperCase() + category.slice(1)
                        try {
                            embed.addField(` ${capitalise} [${dir.size}] - `, dir.map(c => `\`${c.config.name}\``).join(" "))
                        } catch (e) {
                            console.log(e)
                        }
                    })

                    return message.author.send(embed)
                } else {
                    let command = bot.commands.get(bot.aliases.get(args[0].toLowerCase()) || args[0].toLowerCase())
                    if (!command) return message.channel.send(embed.setTitle("**command namotabar**").setDescription(`**bezan \`${prefix}help\` baraye list command ha**`))
                    command = command.config

                    embed.setDescription(stripIndents `**perefix asli bot ine : \`${PREFIX}\`**\n
            **Server Prefix \`${prefix}\`**\n
            ** Command -** ${command.name.slice(0, 1).toUpperCase() + command.name.slice(1)}\n
            ** Description -** ${command.description || "No Description provided."}\n
            **Category -** ${command.category}\n
            ** Usage -** ${command.usage ? `\`${prefix}${command.name} ${command.usage}\`` : "No Usage"}\n
            ** Accessible by -** ${command.accessableby || "everyone"}\n
            ** Aliases -** ${command.aliases ? command.aliases.join(", ") : "None."}`)
            embed.setFooter(message.guild.name, message.guild.iconURL())

            return message.channel.send(embed)
        }
    }
};