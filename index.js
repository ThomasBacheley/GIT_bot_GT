require('dotenv').config();
var fs = require('fs')

const { Client, Intents, Collection } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES] });
client.commands = new Collection()
client.aliases = new Collection()

client.on('ready', () => {
    try {
        console.log(`Logged in as ${client.user.tag}!`);
        client.daily_act = 244;
        client.prefix = process.env.BOT_PREFIX;
        client.data = JSON.parse(fs.readFileSync('./data.json'));
        ////----
        walkSync('./commands', function (filePath, stat) {
            var cmd_get = require('./' + filePath)
            client.commands.set(cmd_get.name, cmd_get);
            if (cmd_get.aliases) {
                cmd_get.aliases.forEach(aliase => { client.aliases.set(aliase, cmd_get); })
            }
        });
        ////----
        require('./functions/updateGT')(client)
    } catch (error) {
        console.log(error)
    }
});

client.on('messageCreate', async message => {
    try {
        if (message.author.bot) return;
        if (message.content.startsWith(client.prefix)) {
            var msgArray = message.content.split(" ")
            var command = msgArray[0]
            var args = msgArray.slice(1)

            var cmd = client.commands.get(command.slice(1)) || client.aliases.get(command.slice(1))

            if (cmd) { cmd.run(client, message, args) }
        }
    } catch (error) {
        console.log(error)
    }
})

client.login(process.env.BOT_TOKEN);

function walkSync(currentDirPath, callback) {
    var path = require('path');
    fs.readdirSync(currentDirPath).forEach(function (name) {
        var filePath = path.join(currentDirPath, name);
        var stat = fs.statSync(filePath);
        if (stat.isFile()) {
            callback(filePath, stat);
        } else if (stat.isDirectory()) {
            walkSync(filePath, callback);
        }
    });
}