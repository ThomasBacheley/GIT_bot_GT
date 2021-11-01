var { MessageEmbed } = require('discord.js');
var getBddconnection = require('../../functions/getBddConnection')

module.exports = {
    name: __filename.split('/')[__filename.split('/').length - 1].replace('.js', ''),
    enable:false,
    description: 'allows you to know whats team are in DB',
    usage: '!teamlist',
    async run(client, message, args) {
        try {
            setTimeout(() => message.delete(), 3000);

            var emb = new MessageEmbed().setColor('#CFEBD5')

            getBddconnection().then((connection) => {
                connection.connect()
                connection.query('SELECT team_name FROM `team`',
                    async function (error, results, fields) {
                        if (error) console.log(error)
                        else {
                            var arr_string = await results.map(r => r.team_name).join(', ')
                            emb.setDescription(arr_string);
                            emb.setAuthor(`Team on Database (${results.length})`);
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