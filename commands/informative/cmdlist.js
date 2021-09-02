var { MessageEmbed } = require('discord.js')
module.exports = {
    name: __filename.split('/')[__filename.split('/').length - 1].replace('.js', ''),
    description: 'to get list of commands',
    usage: '.cmdlist',
    async run(client, message, args) {
        try {
            setTimeout(() => message.delete(), 3000);
            var emb = new MessageEmbed().setAuthor('Commands list').setColor('#CFEBD5');
            client.commands.forEach(cmd => {
                let txt = cmd.usage + '\n' + cmd.description+'\n'
                if(cmd.aliases){
                    txt+='Aliase: '+cmd.aliases.join(', ')
                }
                emb.addField(cmd.name,txt)
            })
            message.reply({ embeds: [emb] }).then(msg => { setTimeout(() => msg.delete(), 30000); })
        } catch (error) {
            message.reply('An error happen, thanks to contact Yweelon as soon as possible').then(msg => { setTimeout(() => msg.delete(), 30000); })
            console.log('[commands/' + __filename.split('/')[__filename.split('/').length - 1].replace('.js', '') + '] L\'erreur suivante à pop :\n' + error.message + '\n\nà cause du message suivant : ' + message.content + ' (par ' + message.author.tag + ')')
        }
    }
}