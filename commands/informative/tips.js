var { MessageEmbed } = require('discord.js');

module.exports = {
    name: __filename.split('/')[__filename.split('/').length - 1].replace('.js', ''),
    description: 'allows you to know some tips',
    usage: '!tips',
    async run(client, message, args) {
        try {
            setTimeout(() => message.delete(), 3000);

            var emb = new MessageEmbed()
            .setColor('#CFEBD5')
            .setAuthor('Tips !')
            .addField('Colosseum Calculator','[here](https://thewwworm.github.io/)',true)
            .addField('Guardian Tales Guides','[here](https://guardiantalesguides.com/)',true)
            .addField('Heavenhold.com','[here](https://heavenhold.com/)',true)
            .addField('Official Website','[here](https://guardiantales.com/)',true)
            .addField('Official Twitter','[here](https://twitter.com/GuardianTalesEN/)',true)

            message.reply({ embeds: [emb] }).then(msg => { setTimeout(() => msg.delete(), 90000); })

        } catch (error) {
            message.reply('An error happen, thanks to contact Yweelon as soon as possible').then(msg => { setTimeout(() => msg.delete(), 30000); })
            console.log('[commands/' + __filename.split('/')[__filename.split('/').length - 1].replace('.js', '') + '] L\'erreur suivante à pop :\n' + error.message + '\n\nà cause du message suivant : ' + message.content + ' (par ' + message.author.tag + ')')
        }
    }
}