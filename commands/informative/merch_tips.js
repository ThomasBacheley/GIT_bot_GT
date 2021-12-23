var { MessageEmbed } = require('discord.js');

module.exports = {
    name: __filename.split('/')[__filename.split('/').length - 1].replace('.js', ''),
    enable:true,
    description: 'allows you to know some merch tips',
    usage: '!tips',
    async run(client, message, args) {
        try {
            setTimeout(() => message.delete(), 3000);

            var emb = new MessageEmbed()
            .setColor('#CFEBD5')
            .setAuthor('Merch Tips !')
            .addField('DPS :','Their respective element (Snow Globe for Fire, eugene bike for light, etc)\nSample statue of bravery if high enough evolution/level and for pvp,\nInvader ship for situational use in raids when high enough evolution/level')
            .addField('Tank','LP Figurine !')
            .addField('Healer','Vending machine')
            .addField('Example','FK : basic element blue merch until you manage to get a high evolution/level statue\nKamael : Do the same if you want him dps or LP figurine to be extra tanky')
        

            message.reply({ embeds: [emb] }).then(msg => { setTimeout(() => msg.delete(), 90000); })

        } catch (error) {
            message.reply('An error happen, thanks to contact Yweelon as soon as possible').then(msg => { setTimeout(() => msg.delete(), 30000); })
            console.log('[commands/' + __filename.split('/')[__filename.split('/').length - 1].replace('.js', '') + '] L\'erreur suivante à pop :\n' + error.message + '\n\nà cause du message suivant : ' + message.content + ' (par ' + message.author.tag + ')')
        }
    }
}