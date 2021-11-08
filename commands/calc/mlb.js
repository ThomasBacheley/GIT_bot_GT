module.exports = {
    name: __filename.split('/')[__filename.split('/').length - 1].replace('.js', ''),
    enable: true,
    description: 'allows you to know how much run is required depending on the number of hero crystal needed',
    usage: '!mlb <number of hero crystal needed>',
    async run(client, message, args) {
        try {
            setTimeout(() => message.delete(), 3000);
            if (!isNaN(args[0])) {
                var data = [15, 15, 15, 20, 20, 20, 15, 10, 15, 25, 18, 19, 21, 14, 17, 24, 16, 26, 24, 17, 15, 21, 18, 17, 17,18, 24, 18, 18, 16, 18, 19, 16, 18, 18, 18, 19, 19, 17, 20, 18, 19, 17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18,14,16]
                var hero_crystal = parseInt(args[0]);

                var max = Math.floor(80 / Math.max(...data))
                var mid = Math.floor(80 / Math.floor(average(data)))
                var min = Math.floor(80 / Math.min(...data))

                message.reply(`${Math.floor(hero_crystal / min) * 10}-${Math.floor(hero_crystal / max) * 10} coffee (aproximatly) to have ${hero_crystal} hero crystal (mid:${Math.floor(hero_crystal / mid) * 10})`).then(msg => { setTimeout(() => msg.delete(), 30000); })

            } else {
                message.reply('you didn\'t give a number').then(msg => { setTimeout(() => msg.delete(), 30000); })
            }
        } catch (error) {
            message.reply('An error happen, thanks to contact Yweelon as soon as possible').then(msg => { setTimeout(() => msg.delete(), 30000); })
            console.log('[commands/' + __filename.split('/')[__filename.split('/').length - 1].replace('.js', '') + '] L\'erreur suivante à pop :\n' + error.message + '\n\nà cause du message suivant : ' + message.content + ' (par ' + message.author.tag + ')')
        }
    }
}


const average = arr => arr.reduce((a, b) => a + b, 0) / arr.length;
