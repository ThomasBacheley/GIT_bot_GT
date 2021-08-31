var { MessageEmbed } = require('discord.js');
var getBddconnection = require('../functions/getBddConnection');

module.exports = {
    name: 'herolist',
    description: 'allows you to know whats heroes are in DB',
    usage: '.herolist',
    async run(client, message, args) {
        try {
            setTimeout(() => message.delete(), 3000);

            var emb = new MessageEmbed().setColor('#CFEBD5')

            getBddconnection().then((connection) => {
                connection.connect()
                connection.query('SELECT name FROM `heroes`',
                    async function (error, results, fields) {
                        if (error) console.log(error)
                        else {
                            var arr_string = await results.map(r=>r.name).join(', ')
                            emb.setDescription(arr_string);
                            emb.setAuthor(`Heroes on Database (${results.length}/64)`);
                            message.reply({ embeds: [emb] }).then(msg => { setTimeout(() => msg.delete(), 90000); })
                        }
                    });
            })

        } catch (error) {
            message.reply('An error happen, thanks to contact Yweelon as soon as possible').then(msg => { setTimeout(() => msg.delete(), 30000); })
            console.log('[commands/heroinfo.js] L\'erreur suivante à pop :\n' + error.message + '\n\nà cause du message suivant : ' + message.content + ' (par ' + message.author.tag + ')')
        }
    }
}