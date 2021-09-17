var { MessageEmbed } = require('discord.js');
var getBddconnection = require('../functions/getBddConnection');

module.exports = {
    name: __filename.split('/')[__filename.split('/').length - 1].replace('.js', ''),
    aliases: ['infohero'],
    description: 'to get info about a hero',
    usage: '.heroinfo <hero name>',
    async run(client, message, args) {
        try {
            setTimeout(() => message.delete(), 3000);

            var emb = new MessageEmbed();

            getBddconnection().then((connection) => {
                connection.connect()
                // connection.query('SELECT * FROM `heroes` WHERE `name` = \''+args.join(' ')+'\'',
                connection.query('SELECT * FROM `heroes` WHERE `name` LIKE ? OR  `name` LIKE ? OR `name` LIKE ? OR `name` LIKE ?', [args.join(' '), args.join(' ').toLowerCase(), args.join(''), args.join('').toLowerCase()],
                    function (error, results, fields) {
                        if (error) console.log(error)
                        if(!results[0]) {
                            connection.query(`SELECT DISTINCT name FROM \`heroes\` WHERE name LIKE '%${args.join('%')}%'`,
                            async function (error, results, fields) {
                                if (error) console.log(error)
                                if(!results[0]){
                                    message.reply(`I don't find \`${args.join(' ')}\` in Database`).then(msg => { setTimeout(() => msg.delete(), 15000); })
                                }else{
                                    let arr = results.map(el=>el.name)
                                    message.reply(`You mean maybe \`${arr.slice(0,-1).join(',')+' or '+arr.slice(-1)}\` ?`).then(msg => { setTimeout(() => msg.delete(), 40000); })
                                }
                            })
                        }else {
                            emb.setThumbnail(results[0].pp_link);
                            emb.setAuthor(`${results[0].name} (${results[0].type})`, null, results[0].champion_link);
                            if (results[0].shield != 'NULL') {
                                emb.addField('Weapon :', results[0].weapon, true);
                                emb.addField('Shield :', results[0].shield, true)
                            } else {
                                emb.addField('Weapon :', results[0].weapon);
                            }
                            emb.addField('Accesory :', results[0].accesory);
                            emb.addField('Cards :', results[0].cards, true);
                            emb.addField('Merch Item :', results[0].merch_item, true);

                            emb.setDescription('If you have modification suggestion, [click here](http://yweelon.fr/GT_updatehero.html)');

                            switch (results[0].type) {
                                case 'Earth':
                                    emb.setColor('#8F4F1A');
                                    break;
                                case 'Light':
                                    emb.setColor('#f5b800');
                                    break;
                                case 'Water':
                                    emb.setColor('#2D84BC');
                                    break;
                                case 'Fire':
                                    emb.setColor('#CB3636');
                                    break;
                                case 'Dark':
                                    emb.setColor('#8005C7');
                                    break;
                                case 'Basic':
                                    emb.setColor('#BFBFBF');
                                    break;
                                default:
                                    emb.setColor('#CFEBD5');
                                    break;
                            }

                            message.reply({ embeds: [emb] }).then(msg => { setTimeout(() => msg.delete(), 90000); })
                        }
                    });
            })

        } catch (error) {
            message.reply('An error happen, thanks to contact Yweelon as soon as possible').then(msg => { setTimeout(() => msg.delete(), 30000); })
            console.log('[commands/'+__filename.split('/')[__filename.split('/').length - 1].replace('.js', '')+'] L\'erreur suivante à pop :\n' + error.message + '\n\nà cause du message suivant : ' + message.content + ' (par ' + message.author.tag + ')')
        }
    }
}