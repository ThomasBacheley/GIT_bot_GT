module.exports = {
    name: __filename.split('/')[__filename.split('/').length - 1].replace('.js', ''),
    aliases: ['ep'],
    enable: true,
    description: 'allows you to know how much coffee is needed depending on the number of point is required',
    usage: '!event_pount <number of point>',
    async run(client, message, args) {
        try {
            setTimeout(() => message.delete(), 3000);
            if (!isNaN(args[0])) {

                var pts_per_run = 100 // 100 pts pour 10 coffee;

                //180*3 → faille de pierre d'eveil
                //(100 / 10) * 100 → café quotidient ( boite mail )
                //(140 / 10) * 100 → café obtenable dans 24h
                //9*60 → colisée

                var daily_point = (180 * 3) + ((100 / 10) * 100) + ((140 / 10) * 100) + (9 * 60)

                if (Number.isInteger(args[0] / daily_point)) {
                    message.reply(`${Math.round((args[0] / pts_per_run) * 10)} coffee is required (or ${args[0] / daily_point} day(s))`).then(msg => { setTimeout(() => msg.delete(), client.configuration.cmd.timeout); })
                } else {
                    message.reply(`${Math.round((args[0] / pts_per_run) * 10)} coffee is required`).then(msg => { setTimeout(() => msg.delete(), client.configuration.cmd.timeout); })
                }

            } else {
                message.reply('you didn\'t give a number').then(msg => { setTimeout(() => msg.delete(), 30000); })
            }
        } catch (error) {
            message.reply('An error happen, thanks to contact Yweelon as soon as possible').then(msg => { setTimeout(() => msg.delete(), 30000); })
            console.log('[commands/' + __filename.split('/')[__filename.split('/').length - 1].replace('.js', '') + '] L\'erreur suivante à pop :\n' + error.message + '\n\nà cause du message suivant : ' + message.content + ' (par ' + message.author.tag + ')')
        }
    }
}