module.exports = {
    name: __filename.split('/')[__filename.split('/').length - 1].replace('.js', ''),
    aliases: ['hc'],
    enable: true,
    description: 'allows you to know how much run is required depending on the number of hero crystal needed',
    usage: '!hero_crystal <number of hero crystal needed>',
    async run(client, message, args) {
        try {
            setTimeout(() => message.delete(), 3000);
            if (!isNaN(args[0])) {
                var data = [15, 15, 15, 20, 20, 20, 15, 10, 15, 25, 18, 19, 21, 14, 17, 24, 16, 26, 24, 17, 15, 21, 18, 17, 17, 18, 24, 18, 18, 16, 18, 19, 16, 18, 18, 18, 19, 19, 17, 20, 18, 19, 17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 14, 16]
                var hero_crystal = parseInt(args[0]);

                //80 pierre d'evolution pour 1 crystal donc
                //1 run donne min x pierre d'evo, mid y pierre d'evo et max z pierre d'evo;

                var nbr_run_minimum = Math.floor(80 / (Math.min(...data)));
                var nbr_run_moyenne = Math.floor(80 / (Math.floor(average(data))));
                var nbr_run_maximum = Math.floor(80 / Math.max(...data));

                message.reply(`${Math.floor(hero_crystal * nbr_run_maximum) * 10}-${Math.floor(hero_crystal * nbr_run_minimum) * 10} coffee (aproximatly) to have ${hero_crystal} hero crystal (mid:${Math.floor(hero_crystal * nbr_run_moyenne) * 10})`).then(msg => { setTimeout(() => msg.delete(), client.configuration.cmd.timeout); })

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
