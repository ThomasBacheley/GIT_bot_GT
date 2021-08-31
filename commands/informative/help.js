var { MessageEmbed } = require('discord.js')
module.exports = {
    name: 'help',
    description: 'to get help about a command',
    usage: '.help <command name>',
    async run(client, message, args) {
        try {
            setTimeout(() => message.delete(), 3000);
            if (client.commands.get(args[0])) {
                var cmd = client.commands.get(args[0])

                var emb = new MessageEmbed()
                    .setAuthor(cmd.name)
                    .addField('Usage :', cmd.usage, true)
                    .setColor('#CFEBD5')
                    .addField('Description :', cmd.description, true);

                message.reply({ embeds: [emb] }).then(msg => { setTimeout(() => msg.delete(), 30000); })
            } else {
                message.reply('i didn\'t find the command').then(msg => { setTimeout(() => msg.delete(), 30000); })
            }
        } catch (error) {
            message.reply('An error happen, thanks to contact Yweelon as soon as possible').then(msg => { setTimeout(() => msg.delete(), 30000); })
            console.log('[commands/help.js] L\'erreur suivante à pop :\n' + error.message + '\n\nà cause du message suivant : ' + message.content + ' (par ' + message.author.tag + ')')
        }
    }
}