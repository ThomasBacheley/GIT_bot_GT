var { MessageEmbed } = require('discord.js');
var getBddconnection = require('../../functions/getBddConnection');
//-------------

module.exports = {
    name: __filename.split('/')[__filename.split('/').length - 1].replace('.js', ''),
    enable: true,
    aliases: ['infohero'],
    description: 'to get info about a hero',
    usage: '!heroinfo <hero name>',
    async run(client, message, args) {
        try {
            setTimeout(() => message.delete(), 3000);
            if (args.length <= 0) {
                message.reply(`You didn\'t provide a hero's name`).then(msg => { setTimeout(() => msg.delete(), 15000); })
            } else {
                var emb = new MessageEmbed();

                getBddconnection().then((connection) => {
                    connection.connect()
                    connection.query(`SELECT DISTINCT heroes.name,ex_weapon.name as 'ex_weapon',ex_weapon.link as 'ex_weapon_link',ex_weapon.emote_type as 'ex_weapon_type',hero_pic,hero_type.type,hero_type.hexcode AS 'type_hexcode',hero_role.role,hero_role.emote AS 'role_emote',weapon,pp_link,hero_link from heroes LEFT JOIN ex_weapon ON heroes.weapon=ex_weapon.id LEFT JOIN hero_type ON heroes.type = hero_type.id LEFT JOIN hero_role ON heroes.role = hero_role.id WHERE heroes.name LIKE '%${args.join(' ')}%' OR heroes.nickname LIKE '%${args.join(' ')}%'`,
                        function (error, results, fields) {
                            if (error) console.log(error)
                            if (!results[0]) {
                                connection.query(`SELECT DISTINCT name FROM \`heroes\` WHERE name LIKE '%${args.join('%')}%'`,
                                    async function (error, results, fields) {
                                        if (error) console.log(error)
                                        if (!results[0]) {
                                            message.reply(`I don't find \`${args.join(' ')}\` in Database`).then(msg => { setTimeout(() => msg.delete(), 15000); })
                                        } else {
                                            let arr = results.map(el => el.name)
                                            message.reply(`You mean maybe \`${arr.slice(0, -1).join(',') + ' or ' + arr.slice(-1)}\` ?`).then(msg => { setTimeout(() => msg.delete(), 40000); })
                                        }
                                    })
                            } else {
                                emb.setThumbnail(results[0].pp_link);
                                if (results[0].hero_pic != null) {
                                    emb.setImage(results[0].hero_pic)
                                }
                                emb.setAuthor(`${results[0].name} (${results[0].type})`, null, results[0].hero_link);
                                emb.setColor(results[0].type_hexcode);
                                emb.addField('Role :', `${results[0].role} ${results[0].role_emote}`, true);
                                emb.addField('Weapon :', `${results[0].ex_weapon} ${results[0].ex_weapon_type} ([?](${results[0].ex_weapon_link} "check the weapon on internet"))`, true);

                                emb.setDescription('If you have modification suggestion, [click here](http://yweelon.fr/GT_updatehero.php?heroname=' + results[0].name.replace(' ', '_').replace(' ', '_').replace(' ', '_').replace(' ', '_').replace(' ', '_') + ')');
                                // emb.setFooter('(PS: If you don\'t see the field `cards` or `accesory`, it\'s because they aren\'t informing !)')

                                message.reply({ embeds: [emb] }).then(msg => { setTimeout(() => msg.delete(), client.configuration.cmd.timeout); })
                            }
                        });
                })
            }
        } catch (error) {
            message.reply('An error happen, thanks to contact Yweelon as soon as possible').then(msg => { setTimeout(() => msg.delete(), 30000); })
            console.log('[commands/' + __filename.split('/')[__filename.split('/').length - 1].replace('.js', '') + '] L\'erreur suivante à pop :\n' + error.message + '\n\nà cause du message suivant : ' + message.content + ' (par ' + message.author.tag + ')')
        }
    }
}
