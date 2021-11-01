var getBddconnection = require('./getBddConnection')
var { Client, MessageEmbed } = require('discord.js')
/**
 * 
 * @param {Client} client 
 * @param {string} hero_name 
 */

module.exports = async function (client, hero_name, username = '') {
    try {
        var emb = new MessageEmbed();

        var chan = client.channels.cache.get(client.main_channel_ID)

        getBddconnection().then((connection) => {
            connection.connect()
            connection.query(`SELECT DISTINCT heroes.name,hero_type.type,hero_type.hexcode AS 'type_hexcode',hero_role.role,hero_role.emote AS 'role_emote',weapon,shield_item.name AS 'shield_name',shield_item.color AS 'shield_color',accesory_item.name AS 'accesory_name',accesory_item.color AS 'accesory_color',cards,merch_item.name AS 'merch_name',merch_item.color AS 'merch_color',pp_link,champion_link from heroes LEFT JOIN hero_type ON heroes.type = hero_type.id LEFT JOIN hero_role ON heroes.role = hero_role.id LEFT JOIN shield_item ON heroes.shield = shield_item.id LEFT JOIN accesory_item ON heroes.accesory = accesory_item.id LEFT JOIN merch_item ON heroes.merch_item = merch_item.id WHERE heroes.name LIKE '%${hero_name}%'`,
                function (error, results, fields) {
                    if (error) console.log(error)
                    if (!results[0]) {
                        connection.query(`SELECT DISTINCT name FROM \`heroes\` WHERE name LIKE '%${hero_name}%'`,
                            async function (error, results, fields) {
                                if (error) console.log(error)
                                if (!results[0]) {
                                    chan.send(`I don't find \`${hero_name}\` in Database`).then(msg => { setTimeout(() => msg.delete(), 15000); })
                                } else {
                                    let arr = results.map(el => el.name)
                                    chan.send(`You mean maybe \`${arr.slice(0, -1).join(',') + ' or ' + arr.slice(-1)}\` ?`).then(msg => { setTimeout(() => msg.delete(), 40000); })
                                }
                            })
                    } else {
                        emb.setThumbnail(results[0].pp_link);
                        emb.setAuthor(`${results[0].name} (${results[0].type})`, null, results[0].champion_link);
                        emb.setColor(results[0].type_hexcode);
                        emb.addField('Role :', `${results[0].role} ${results[0].role_emote}`);
                        emb.addField('Weapon :', results[0].weapon, true);
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
                        let txt = '[Update Version';
                        if (username != '') { txt += ` by ${username}` }

                        chan.send({ content: txt + ']', embeds: [emb] }).then(msg => { setTimeout(() => msg.delete(), 60000); })
                    }
                });
        })
    } catch (error) {
        throw error
    }
}