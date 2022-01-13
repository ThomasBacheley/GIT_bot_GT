var { MessageEmbed } = require('discord.js');
var getBddconnection = require('../../functions/getBddConnection')

module.exports = {
    name: __filename.split('/')[__filename.split('/').length - 1].replace('.js', ''),
    enable:true,
    description: 'allows you to know whats heroes are in DB',
    usage: '!herolist',
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
                            var arr_string = await results.map(r => r.name).join(', ')
                            arr_string+='\n[see on website](http://yweelon.fr/GT_herosheet.php)'
                            emb.setDescription(arr_string);
                            emb.setAuthor(`Heroes on Database (${results.length})`);
                            
                            message.reply({ embeds: [emb] }).then(msg => { setTimeout(() => msg.delete(), client.configuration.cmd.timeout); })
                        }
                    });
            })

        } catch (error) {
            message.reply('An error happen, thanks to contact Yweelon as soon as possible').then(msg => { setTimeout(() => msg.delete(), 30000); })
            console.log('[commands/' + __filename.split('/')[__filename.split('/').length - 1].replace('.js', '') + '] L\'erreur suivante à pop :\n' + error.message + '\n\nà cause du message suivant : ' + message.content + ' (par ' + message.author.tag + ')')
        }
    }
}
