var { DateTime, Interval } = require('luxon')
var p_ms = require('pretty-ms')
module.exports = {
    name: __filename.split('/')[__filename.split('/').length - 1].replace('.js', ''),
    aliases: ['next_update', 'nextupdate'],
    description: 'allows you to know when is the newt update',
    usage: '!nxtupdate',
    async run(client, message, args) {
        try {
            setTimeout(() => message.delete(), 3000);
            const update_day = DateTime.fromFormat(client.data.update_day,'LLL dd');
            const i = Interval.fromDateTimes(DateTime.now(), update_day);

            message.reply(`${Math.floor(i.length('days'))} days until the next update (${client.data.update_day})`).then(msg => { setTimeout(() => msg.delete(), 30000); })
        } catch (error) {
            message.reply('An error happen, thanks to contact Yweelon as soon as possible').then(msg => { setTimeout(() => msg.delete(), 30000); })
            console.log('[commands/' + __filename.split('/')[__filename.split('/').length - 1].replace('.js', '') + '] L\'erreur suivante à pop :\n' + error.message + '\n\nà cause du message suivant : ' + message.content + ' (par ' + message.author.tag + ')')
        }
    }
}