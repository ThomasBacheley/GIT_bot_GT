var { MessageEmbed } = require('discord.js');
var getBddconnection = require('../../functions/getBddConnection')
//-------------

module.exports = {
    name: __filename.split('/')[__filename.split('/').length - 1].replace('.js', ''),
    enable:false,
    aliases: ['infoteam'],
    description: 'to get info about a team',
    usage: '!teaminfo <team name>',
    async run(client, message, args) {
        try {
            setTimeout(() => message.delete(), 3000);

            var emb = new MessageEmbed();

            getBddconnection().then((connection) => {
                connection.connect()
                // connection.query('SELECT * FROM `heroes` WHERE `name` = \''+args.join(' ')+'\'',
                connection.query(`SELECT DISTINCT team_name,(SELECT name from heroes WHERE id = hero_1) AS 'H1',(SELECT name from heroes WHERE id = hero_2) AS 'H2',(SELECT name from heroes WHERE id = hero_3) AS 'H3',(SELECT name from heroes WHERE id = hero_4) AS 'H4',agree,disagree from team WHERE team_name LIKE '%${args.join(' ')}%'`,
                    function (error, results, fields) {
                        if (error) console.log(error)
                        if (!results[0]) {
                            connection.query(`SELECT DISTINCT team_name FROM \`team\` WHERE team_name LIKE '%${args.join('%')}%'`,
                                async function (error, results, fields) {
                                    if (error) console.log(error)
                                    if (!results[0]) {
                                        message.reply(`I don't find \`${args.join(' ')}\` in Database`).then(msg => { setTimeout(() => msg.delete(), 15000); })
                                    } else {
                                        let arr = results.map(el => el.team_name)
                                        message.reply(`You mean maybe \`${arr.slice(0, -1).join(',') + ' or ' + arr.slice(-1)}\` ?`).then(msg => { setTimeout(() => msg.delete(), 40000); })
                                    }
                                })
                        } else {

                            emb.setAuthor(`${results[0].team_name} (${parseInt(results[0].agree)} 👍\/${parseInt(results[0].disagree)} 👎)`);

                            emb.addField('Hero 1 :',results[0].H1)
                            emb.addField('Hero 2 :',results[0].H2)
                            emb.addField('Hero 3 :',results[0].H3)
                            emb.addField('Hero 4 :',results[0].H4);

                            message.reply({ embeds: [emb] }).then(msg => { setTimeout(() => msg.delete(), 90000); })
                        }
                    });
            })

        } catch (error) {
            message.reply('An error happen, thanks to contact Yweelon as soon as possible').then(msg => { setTimeout(() => msg.delete(), 30000); })
            console.log('[commands/' + __filename.split('/')[__filename.split('/').length - 1].replace('.js', '') + '] L\'erreur suivante à pop :\n' + error.message + '\n\nà cause du message suivant : ' + message.content + ' (par ' + message.author.tag + ')')
        }
    }
}