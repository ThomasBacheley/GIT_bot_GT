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

var getBddConnection = require('./functions/getBddConnection')

client.login(process.env.BOT_TOKEN);

const express = require('express')
const app = express()

app.get('/', (req, res) => { res.send('Hello World!') });

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

app.use(express.urlencoded({ extended: true }))

app.use('/paramlist', require('./api/paramlist'));

app.use('/listoftype', require('./api/listoftype'))
app.use('/listofrole', require('./api/listofrole'))
app.use('/listofshield', require('./api/listofshield'))
app.use('/listofaccesory', require('./api/listofaccesory'))
app.use('/listofmerch_item', require('./api/listofmerch_item'))

var { DateTime } = require('luxon')

app.post('/updatehero', (req, res) => {
    getBddConnection().then((connection) => {
        connection.connect()
        connection.query("SELECT id FROM heroes WHERE name = '" + req.body.select_hero + "'",
            async function (error, results, fields) {
                if (error) console.log(error)
                if (results.length == 0) {
                    res.send('It seems that hero doesn\'t exist in Database')
                } else {
                    let query = "UPDATE heroes SET " + req.body.select_param + " = ";
                    switch (req.body.select_param) {
                        case 'type':
                            query += "(SELECT id from hero_type WHERE type = '" + req.body.newvalue + "')";
                            break;
                        case 'role':
                            query += "(SELECT id from hero_role WHERE role = '" + req.body.newvalue + "')";
                            break;
                        case 'shield':
                            query += "(SELECT id from shield_item WHERE name = '" + req.body.newvalue + "')";
                            break;
                        case 'accesory':
                            query += "(SELECT id from accesory_item WHERE name = '" + req.body.newvalue + "')";
                            break;
                        case 'merch_item':
                            query += "(SELECT id from merch_item WHERE name = '" + req.body.newvalue + "')";
                            break;
                        default:
                            query += "'" + req.body.newvalue + "'";
                            break;
                    }
                    connection.query(`${query} WHERE name = '${req.body.select_hero}'`,
                        async function (error, results, fields) {
                            if (error) console.log(error)
                            else {
                                let complement = ''
                                if (req.body.username != '') { complement += ` par ${req.body.username}` }
                                console.log('Update le ' + DateTime.now().toFormat('dd/LLL- HH:mm') + complement + '\n', { "Hero": req.body.select_hero, "Parametre modifer": req.body.select_param, "Nouvelle valeur": req.body.newvalue });
                                res.sendFile(path.join(__dirname, '/success_page.html'))
                            }
                        });
                }
            })
    })
})

app.post('/addhero', (req, res) => {
    //...
    var hero = req.body;

    getBddConnection().then((connection) => {
        connection.connect()
        connection.query('SELECT id FROM `heroes` WHERE name LIKE ?', [hero.hero_name],
            async function (error, results, fields) {
                if (error) console.log(error)
                else {
                    if (results[0]) {
                        res.send('This Hero is already in the DataBase !')
                    } else {
                        connection.query('INSERT INTO `heroes`(`name`, `type`, `role`, `weapon`, `shield`, `accesory`, `cards`, `merch_item`, `pp_link`, `champion_link`) VALUES (?,(SELECT id from hero_type WHERE hero_type.type = ?),(SELECT id from hero_role WHERE hero_role.role = ?),?,(SELECT id from shield_item WHERE shield_item.name = ?),(SELECT id from accesory_item WHERE accesory_item.name = ?),?,(SELECT id from merch_item WHERE merch_item.name=?),?,?)',
                            [hero.hero_name, hero.hero_type, hero.hero_role, hero.weapon_name, hero.shield_name, hero.accesory_name, hero.cards_name, hero.merchitem_name, hero.pp_link, hero.champion_link],
                            function (error, results, fields) {
                                if (error) console.log(error)
                                else {
                                    let complement = ''
                                    if (req.body.username != '') { complement += ` par ${req.body.username}` }
                                    console.log(hero.hero_name + ' ajouter à la base de données le ' + DateTime.now().toFormat('dd/LLL- HH:mm') + complement + '!')
                                    res.sendFile(path.join(__dirname, '/success_page.html'))
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
