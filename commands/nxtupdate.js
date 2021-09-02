var { DateTime } = require('luxon')
var p_ms = require('pretty-ms')
module.exports = {
    name: __filename.split('/')[__filename.split('/').length - 1].replace('.js', ''),
    aliases: ['next_update','nextupdate'],
    description: 'allows you to know when is the newt update',
    usage: '.nxtupdate',
    async run(client, message, args) {
        try {
            setTimeout(() => message.delete(), 3000);

            var d1 = DateTime.fromISO(client.data.update_day);
            var d2 = DateTime.fromISO(DateTime.now())

            message.reply(`${p_ms(d1.diff(d2).toObject().milliseconds)} until the next update`).then(msg => { setTimeout(() => msg.delete(), 30000); })
        } catch (error) {
            message.reply('An error happen, thanks to contact Yweelon as soon as possible').then(msg => { setTimeout(() => msg.delete(), 30000); })
            console.log('[commands/' + __filename.split('/')[__filename.split('/').length - 1].replace('.js', '') + '] L\'erreur suivante à pop :\n' + error.message + '\n\nà cause du message suivant : ' + message.content + ' (par ' + message.author.tag + ')')
        }
    }
}