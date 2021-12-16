var { MessageEmbed } = require('discord.js')
var emote_array = [
    '1️⃣',
    '2️⃣',
    '3️⃣',
    '4️⃣',
    '5️⃣',
    '6️⃣',
    '7️⃣',
    '8️⃣',
    '9️⃣',
    '🔟',
]

module.exports = {
    name: __filename.split('/')[__filename.split('/').length - 1].replace('.js', ''),
    enable: true,
    description: 'create a poll',
    usage: '!poll "<question>" "<choose1>" "<choose2>" "<choose X>"',
    async run(client, message, args) {
        try {
            setTimeout(() => message.delete(), 3000);

            if (client.AdminUserId.includes(message.author.id)) {
                var embed = new MessageEmbed()
                    .setColor('GREEN')
                    .setAuthor(`Poll by ${message.author.username}`, message.author.avatarURL())
                    .setTimestamp();

                var arguments = await traitement_args(args);

                embed.setTitle(arguments.question)
                embed.setDescription(arguments.desc);

                message.reply({ embeds: [embed] }).then(msg => {
                    for (i = 0; i < arguments.nbr_choose; i++) {
                        msg.react(emote_array[i]);
                    }
                    setTimeout(() => msg.delete(), 60 * 60000);//1h
                })
            } else {
                message.reply('You\'re not a Admin').then(msg => { setTimeout(() => msg.delete(), 30000); })
            }

        } catch (error) {
            message.reply('An error happen, thanks to contact Yweelon as soon as possible').then(msg => { setTimeout(() => msg.delete(), 30000); })
            console.log('[commands/' + __filename.split('/')[__filename.split('/').length - 1].replace('.js', '') + '] L\'erreur suivante à pop :\n' + error.message + '\n\nà cause du message suivant : ' + message.content + ' (par ' + message.author.tag + ')')
        }
    }
}

async function traitement_args(args) {
    try {
        var temp_args = args.join(' ')
        var array_args = temp_args.split('"').filter(el => el != '' && el != ' ');
        var description = ''
        let i = 0;
        array_args.slice(1).forEach(arg => {
            description += `${emote_array[i]} ${arg}\n`
            i++
        });

        return {
            question: array_args[0],
            desc: description,
            nbr_choose: array_args.length - 1
        }
    } catch (error) {
        throw error
    }
}