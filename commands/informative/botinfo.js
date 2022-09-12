var { MessageEmbed } = require('discord.js');
var { DateTime } = require('luxon')

module.exports = {
    name: __filename.split('/')[__filename.split('/').length - 1].replace('.js', ''),
    enable:true,
    description: 'Show information about the bot',
    usage: '!botinfo',
    async run(client, message, args) {
        try {
            setTimeout(() => message.delete(), 3000);

            var emb = new MessageEmbed()
            .setColor('#CFEBD5')
            .setAuthor('Informations')
            .addField('Creation Date :',DateTime.fromJSDate(client.user.createdAt).toFormat('dd LLL yyyy'))
            .addField('Bot Owner :','<@!663153459226345501>')
            message.reply({ embeds: [emb] }).then(msg => { setTimeout(() => msg.delete(), client.configuration.cmd.timeout); })

        } catch (error) {
            message.reply('An error happen, thanks to contact Yweelon as soon as possible').then(msg => { setTimeout(() => msg.delete(), 30000); })
            console.log('[commands/' + __filename.split('/')[__filename.split('/').length - 1].replace('.js', '') + '] L\'erreur suivante à pop :\n' + error.message + '\n\nà cause du message suivant : ' + message.content + ' (par ' + message.author.tag + ')')
        }
    }
}