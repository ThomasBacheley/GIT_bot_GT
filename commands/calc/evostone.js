module.exports = {
    name: __filename.split('/')[__filename.split('/').length - 1].replace('.js', ''),
    aliases: ['evo_stone'],
    description: 'allows you to know how much coffee is required depending on the desired number of stones',
    usage: '.evostone <number of evo stone>',
    async run(client, message, args) {
        try {
            setTimeout(() => message.delete(), 3000);
            if (!isNaN(args[0])) {
                var num_evo_stone = parseInt(args[0]);
                var coffee = num_evo_stone*10;
                // var result = Math.floor(num_evo_stone / Math.floor(client.daily_act / 10));
                var p_ms = require('pretty-ms')
                message.reply(`You will need aproximatly ${coffee} coffee !`).then(msg => { setTimeout(() => msg.delete(), 30000); })

            } else {
                message.reply('you didn\'t give a number').then(msg => { setTimeout(() => msg.delete(), 30000); })
            }
        } catch (error) {
            message.reply('An error happen, thanks to contact Yweelon as soon as possible').then(msg => { setTimeout(() => msg.delete(), 30000); })
            console.log('[commands/' + __filename.split('/')[__filename.split('/').length - 1].replace('.js', '') + '] L\'erreur suivante à pop :\n' + error.message + '\n\nà cause du message suivant : ' + message.content + ' (par ' + message.author.tag + ')')
        }
    }
}