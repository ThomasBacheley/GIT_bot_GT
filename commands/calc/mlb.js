module.exports = {
    name: __filename.split('/')[__filename.split('/').length - 1].replace('.js', ''),
    enable:true,
    description: 'allows you to know how much hero crystal is required depending on the number of hero crystal owned',
    usage: '!mlb <number of hero crystal owned>',
    async run(client, message, args) {
        try {
            setTimeout(() => message.delete(), 3000);
            if (!isNaN(args[0])) {
                var num_evo_stone = parseInt(args[0]);
                var result = num_evo_stone*10;
                // var result = Math.floor(num_evo_stone / Math.floor(client.daily_act / 10));
                var p_ms = require('pretty-ms')
                message.reply(`${700-parseInt(args[0])} hero crystal needed to MLB`).then(msg => { setTimeout(() => msg.delete(), 30000); })

            } else {
                message.reply('you didn\'t give a number').then(msg => { setTimeout(() => msg.delete(), 30000); })
            }
        } catch (error) {
            message.reply('An error happen, thanks to contact Yweelon as soon as possible').then(msg => { setTimeout(() => msg.delete(), 30000); })
            console.log('[commands/' + __filename.split('/')[__filename.split('/').length - 1].replace('.js', '') + '] L\'erreur suivante à pop :\n' + error.message + '\n\nà cause du message suivant : ' + message.content + ' (par ' + message.author.tag + ')')
        }
    }
}