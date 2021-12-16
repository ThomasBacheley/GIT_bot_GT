var { MessageEmbed } = require('discord.js');
var getBddconnection = require('../../functions/getBddConnection')
//-------------
var orange_emote = ' <:orange_star:897208612143898644>'
var yellow_emote = ' <:yellow_star:897208611812540427>'
var green_emote = '  <:green_star:897208612039053322>'
//-------------

module.exports = {
    name: __filename.split('/')[__filename.split('/').length - 1].replace('.js', ''),
    enable: true,
    aliases: ['buildhero'],
    description: 'to get build about a hero',
    usage: '!herobuild <hero name>',
    async run(client, message, args) {
        try {
            setTimeout(() => message.delete(), 3000);
            if (args.length <= 0) {
                message.reply(`You didn\'t provide a hero's name`).then(msg => { setTimeout(() => msg.delete(), 15000); })
            } else {
                var emb = new MessageEmbed();

                getBddconnection().then((connection) => {
                    connection.connect()
                    // connection.query('SELECT * FROM `heroes` WHERE `name` = \''+args.join(' ')+'\'',
                    connection.query(`SELECT DISTINCT heroes.name,hero_type.type,hero_type.hexcode AS 'type_hexcode',ex_weapon.name as 'ex_weapon',ex_weapon.link as 'ex_weapon_link',ex_weapon.emote_type as 'ex_weapon_type',shield_item.name AS 'shield_name',shield_item.color AS 'shield_color',accesory_item.name AS 'accesory_name',accesory_item.color AS 'accesory_color',cards,merch_item.name AS 'merch_name',merch_item.color AS 'merch_color',pp_link,hero_link from heroes LEFT JOIN ex_weapon ON heroes.weapon=ex_weapon.id LEFT JOIN hero_type ON heroes.type = hero_type.id LEFT JOIN shield_item ON heroes.shield = shield_item.id LEFT JOIN accesory_item ON heroes.accesory = accesory_item.id LEFT JOIN merch_item ON heroes.merch_item = merch_item.id WHERE heroes.name LIKE '%${args.join(' ')}%' OR heroes.nickname LIKE '%${args.join(' ')}%'`,
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
                                emb.setAuthor(`${results[0].name} (${results[0].type})`, null, results[0].hero_link);
                                emb.setColor(results[0].type_hexcode);
                                emb.addField('Weapon :', `${results[0].ex_weapon} ${results[0].ex_weapon_type} ([?](${results[0].ex_weapon_link} "check the weapon on internet"))`, true);
                                if (results[0].shield_name != null) {
                                    switch (results[0].shield_color) {
                                        case 'orange':
                                            emb.addField('Shield :', results[0].shield_name + orange_emote);
                                            break;
                                        case 'yellow':
                                            emb.addField('Shield :', results[0].shield_name + yellow_emote);
                                            break;
                                        case 'green':
                                            emb.addField('Shield :', results[0].shield_name + green_emote);
                                            break;
                                        default:
                                            emb.addField('Shield :', results[0].shield_name + ' (' + results[0].shield_color + ')');
                                            break
                                    }
                                }
                                if (results[0].accesory_name != null) {
                                    switch (results[0].accesory_color) {
                                        case 'orange':
                                            emb.addField('Accesory :', results[0].accesory_name + orange_emote);
                                            break;
                                        case 'yellow':
                                            emb.addField('Accesory :', results[0].accesory_name + yellow_emote);
                                            break;
                                        case 'green':
                                            emb.addField('Accesory :', results[0].accesory_name + green_emote);
                                            break;
                                        default:
                                            emb.addField('Accesory :', results[0].accesory_name + ' (' + results[0].accesory_color + ')');
                                            break
                                    }
                                }
                                if (results[0].cards != 'NULL') {
                                    emb.addField('Cards :', results[0].cards, true);
                                }
                                if (results[0].merch_name != null) {
                                    switch (results[0].merch_color) {
                                        case 'orange':
                                            emb.addField('Merch Item :', results[0].merch_name + orange_emote, true);
                                            break;
                                        case 'yellow':
                                            emb.addField('Merch Item :', results[0].merch_name + yellow_emote, true);
                                            break;
                                        case 'green':
                                            emb.addField('Merch Item :', results[0].merch_name + green_emote, true);
                                            break;
                                        default:
                                            emb.addField('Merch Item :', results[0].merch_name + ' (' + results[0].merch_color + ')', true);
                                            break
                                    }
                                }

                                emb.setDescription('If you have modification suggestion, [click here](http://yweelon.fr/GT_updatehero.html?heroname=' + results[0].name.replace(' ', '_').replace(' ', '_').replace(' ', '_').replace(' ', '_').replace(' ', '_') + ')');
                                emb.setFooter('(PS: If you don\'t see the field `cards` or `accesory`, it\'s because they aren\'t informing !)')

                                message.reply({ embeds: [emb] }).then(msg => { setTimeout(() => msg.delete(), 90000); })
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