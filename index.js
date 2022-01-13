console.clear()

require('dotenv').config();

var fs = require('fs')

var path = require('path');

const { Client, Intents, Collection } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES] });
client.commands = new Collection()
client.aliases = new Collection()

client.on('ready', () => {
    try {
        console.log(`Logged in as ${client.user.tag}!`);

        require('./functions/pp')(client)

        client.prefix = process.env.BOT_PREFIX;

        client.data = JSON.parse(fs.readFileSync('./data.json'));

        client.user.setActivity('Guardian Tale with GreenIceTeam', { type: 'PLAYING' });

        client.configuration = JSON.parse(fs.readFileSync('./configuration.json', 'utf8'));

        walkSync('./commands', function (filePath, stat) {
            var cmd_get = require('./' + filePath)

            if (cmd_get.enable) {
                client.commands.set(cmd_get.name, cmd_get);

                if (cmd_get.aliases) {
                    cmd_get.aliases.forEach(aliase => { client.aliases.set(aliase, cmd_get); })
                }
            }
        });

        require('./functions/updateGT')(client);

    } catch (error) {
        console.log(error)
    }
});

client.on('messageCreate', async message => {
    try {
        if (message.author.bot) return;
        if (!client.configuration.AllowedChannelID.includes(message.channel.id)) return;
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

const express = require('express')
var bodyParser = require('body-parser')
const app = express()

app.use(bodyParser.json())

app.get('/', (req, res) => { res.send('Hello World!') });

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});
app.use(express.urlencoded({ extended: true }))

walkSync('./api', function (filePath, stat) {
    let api_path = '/'+filePath.split('/')[filePath.split('/').length - 1].replace('.js', '')
    app.use(api_path,require('./'+filePath))
});

app.listen(8084, () => { console.log(`Example app listening at http://localhost:8084`) })

function walkSync(currentDirPath, callback) {
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