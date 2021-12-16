console.clear()
require('dotenv').config();
var fs = require('fs')
var path = require('path');

const { Client, Intents, Collection } = require('discord.js');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES] });
client.commands = new Collection()
client.aliases = new Collection()

client.AllowedChannelID = ['749900170417799209', '665303635478970438', '648936915789283338'];
client.AdminUserId = ['663153459226345501','278198463785730050']

client.on('ready', () => {
    try {
        console.log(`Logged in as ${client.user.tag}!`);
        require('./functions/pp')(client)
        client.daily_act = 244;
        client.prefix = process.env.BOT_PREFIX;
        client.data = JSON.parse(fs.readFileSync('./data.json'));
        client.user.setActivity('Guardian Tale with GreenIceTeam', { type: 'PLAYING' });
        ////----
        walkSync('./commands', function (filePath, stat) {
            var cmd_get = require('./' + filePath)
            if (cmd_get.enable) {
                client.commands.set(cmd_get.name, cmd_get);
                if (cmd_get.aliases) {
                    cmd_get.aliases.forEach(aliase => { client.aliases.set(aliase, cmd_get); })
                }
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
        if (!client.AllowedChannelID.includes(message.channel.id)) return;
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

var getBddConnection = require('./functions/getBddConnection')

client.login(process.env.BOT_TOKEN);

const express = require('express')
var bodyParser = require('body-parser')

var jsonParser = bodyParser.json()

const app = express()


app.get('/', (req, res) => { res.send('Hello World!') });

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.use(express.urlencoded({ extended: true }))
//#region GET
app.use('/paramlist', require('./api/GET/paramlist'));
app.use('/listoftype', require('./api/GET/listoftype'))
app.use('/listofrole', require('./api/GET/listofrole'))
app.use('/listofshield', require('./api/GET/listofshield'))
app.use('/listofaccesory', require('./api/GET/listofaccesory'))
app.use('/listofmerch_item', require('./api/GET/listofmerch_item'))
app.use('/listofexweapontype', require('./api/GET/listofexweapontype'))
app.use('/gethero',require('./api/GET/gethero'))
//#endregion
//#region POST
app.use('/updatehero', require('./api/POST/updatehero'))
app.use('/addhero', require('./api/POST/addhero'))
//#endregion

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