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
        client.daily_act = 244;
        client.prefix = process.env.BOT_PREFIX;
        client.data = JSON.parse(fs.readFileSync('./data.json'));
        client.user.setActivity('Guardian Tale with GreenIceTeam', { type: 'PLAYING' });
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

const express = require('express')
const app = express()

app.get('/', (req, res) => { res.send('Hello World!') });

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.use(express.urlencoded({ extended: true }))

var getBddConnection = require('./functions/getBddConnection')

app.get('/herolist', async (req, res) => {
    getBddConnection().then((connection) => {
        connection.connect()
        connection.query('SELECT name FROM `heroes`',
            async function (error, results, fields) {
                if (error) console.log(error)
                else {
                    var arr = await results.map(r => r.name)
                    res.send(arr)
                }
            });
    })
});

app.get('/paramlist', async (req, res) => {
    getBddConnection().then((connection) => {
        connection.connect()
        connection.query('SELECT * FROM `heroes` WHERE id = ?', [1],
            async function (error, results, fields) {
                if (error) console.log(error)
                else {
                    var arr = await fields.map(field => field.name).splice(2, fields.length)
                    res.send(arr)
                }
            });
    })
});

app.get('/accesorylist', async (req, res) => {
    getBddConnection().then((connection) => {
        connection.connect()
        connection.query('SELECT name,color FROM `accesory_item` ORDER BY FIELD(color,"green","yellow","orange")',
            async function (error, results, fields) {
                if (error) console.log(error)
                else {
                    res.send(results)
                }
            });
    })
});

app.get('/merchitemlist', async (req, res) => {
    getBddConnection().then((connection) => {
        connection.connect()
        connection.query('SELECT name,color FROM `merch_item` ORDER BY FIELD(color,"orange","blue")',
            async function (error, results, fields) {
                if (error) console.log(error)
                else {
                    res.send(results)
                }
            });
    })
});

app.get('/shieldlist', async (req, res) => {
    getBddConnection().then((connection) => {
        connection.connect()
        connection.query('SELECT name,color FROM `shield_item` ORDER BY FIELD(color,"green","yellow")',
            async function (error, results, fields) {
                if (error) console.log(error)
                else {
                    res.send(results)
                }
            });
    })
});

app.post('/updatehero', (req, res) => {
    //...
    getBddConnection().then((connection) => {
        connection.connect()
        connection.query("UPDATE heroes SET " + req.body.select_param + " = '" + req.body.Textinpute_value + "' WHERE name = '" + req.body.select_hero + "'",
            async function (error, results, fields) {
                if (error) console.log(error)
                else {
                    console.log(req.body.select_hero + ' update !');
                }
            });
    })
    res.send("it's not pretty but it's work (ps: you can go back)");
    //
})

app.post('/addhero', (req, res) => {
    //...
    var hero = req.body;

    getBddConnection().then((connection) => {
        connection.connect()
        connection.query('SELECT id FROM `heroes` WHERE name LIKE ?',[hero.hero_name],
            async function (error, results, fields) {
                if (error) console.log(error)
                else {
                    if (results[0]) {
                        res.send('This Hero is already in the DataBase !')
                    } else {
                        connection.query('INSERT INTO heroes (`name`,`type`,`role`,`weapon`,`shield`,`accesory`,`cards`,`merch_item`,`pp_link`,`champion_link`) VALUES (?,?,?,?,?,?,?,?,?,?)',
                            [hero.hero_name, hero.hero_type, hero.hero_role, hero.weapon_name, hero.shield_name, hero.accesory_name, hero.cards_name, hero.merchitem_name, hero.pp_link, hero.champion_link],
                            function (error, results, fields) {
                                if (error) console.log(error)
                                else {
                                    console.log(hero.hero_name + ' ajouter à la base de données !')
                                    res.send("it's not pretty but it's work (ps: you can go back)");
                                }
                            });
                    }
                }
            });
    });
    //
})

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