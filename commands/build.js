var { MessageEmbed } = require('discord.js')
module.exports = {
    name: __filename.split('/')[__filename.split('/').length - 1].replace('.js', ''),
    enable:false,
    description: 'to get help about a hero build',
    usage: '!build <heroe name>',
    async run(client, message, args) {
        try {
            setTimeout(() => message.delete(), 3000);

            var emb = new MessageEmbed().setDescription(`[${args[0]}](https://heavenhold.com/heroes/${args[0]})`).setColor('#CFEBD5');
            message.reply({ embeds: [emb] }).then(msg => { setTimeout(() => msg.delete(), 30000); })
        } catch (error) {
            message.reply('An error happen, thanks to contact Yweelon as soon as possible').then(msg => { setTimeout(() => msg.delete(), 30000); })
            console.log('[commands/'+__filename.split('/')[__filename.split('/').length - 1].replace('.js', '')+'] L\'erreur suivante à pop :\n' + error.message + '\n\nà cause du message suivant : ' + message.content + ' (par ' + message.author.tag + ')')
        }
    }
}