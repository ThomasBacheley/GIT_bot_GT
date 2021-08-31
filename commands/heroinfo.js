var { MessageEmbed } = require('discord.js');
var getBddconnection = require('../functions/getBddConnection');

module.exports = {
    name: 'heroinfo',
    aliases: ['infohero'],
    description: 'to get info about a hero',
    usage: '.heroinfo <hero name>',
    async run(client, message, args) {
        try {
            setTimeout(() => message.delete(), 3000);

            var emb = new MessageEmbed().setColor('#CFEBD5');

            getBddconnection().then((connection) => {
                connection.connect()
                // connection.query('SELECT * FROM `heroes` WHERE `name` = \''+args.join(' ')+'\'',
                connection.query('SELECT * FROM `heroes` WHERE `name` LIKE ? OR  `name` LIKE ? OR `name` LIKE ? OR `name` LIKE ?', [args.join(' '),args.join(' ').toLowerCase(),args.join(''),args.join('').toLowerCase()],
                    function (error, results, fields) {
                        if (error) console.log(error)
                        else {
                            emb.setThumbnail(results[0].pp_link);
                            emb.setAuthor(results[0].name,null,results[0].champion_link);
                            if(results[0].shield != 'NULL') {
                                emb.addField('Weapon :',results[0].weapon,true);
                                emb.addField('Shield :',results[0].shield,true)
                            }else{
                                emb.addField('Weapon :',results[0].weapon);
                            }
                            emb.addField('Accesory :',results[0].accesory);
                            emb.addField('Cards :',results[0].cards,true);
                            emb.addField('Merch Item :',results[0].merch_item,true);

                            message.reply({ embeds: [emb] }).then(msg => { setTimeout(() => msg.delete(), 30000); })
                        }
                    });
            })

        } catch (error) {
            message.reply('An error happen, thanks to contact Yweelon as soon as possible').then(msg => { setTimeout(() => msg.delete(), 30000); })
            console.log('[commands/heroinfo.js] L\'erreur suivante à pop :\n' + error.message + '\n\nà cause du message suivant : ' + message.content + ' (par ' + message.author.tag + ')')
        }
    }
}