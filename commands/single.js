const { createCanvas, loadImage } = require('canvas');
var { MessageEmbed, MessageAttachment } = require('discord.js')
var summon = require('../functions/summon');

module.exports = {
    name: __filename.split('/')[__filename.split('/').length - 1].replace('.js', ''),
    enable: true,
    description: 'to do a single',
    usage: '!single',
    async run(client, message, args) {
        try {
            setTimeout(() => message.delete(), 3000);
            await summon(message,false).then(resultat => {
                var emb = new MessageEmbed()
                    .setTitle('Single')
                    .setColor('#2F3136')
                    .setFooter(`1 star :${resultat.drop.one_star} | 2 star :${resultat.drop.two_star} | 3 star :${resultat.drop.three_star}`);
                if (resultat.multi[0].name) {
                    emb.setImage(resultat.multi[0].hero_pic);
                    resultat.multi[0] = resultat.multi[0].name
                } else {
                    resultat.multi[0] = resultat.multi[0].dsc
                }
                emb.setDescription(resultat.multi.join(',     ').toString());
                if (resultat.drop.three_star > 0) {
                    sleep(8000).then(() => {
                        setTimeout(() => resultat.msggif.delete(), 3000);
                        resultat.msggif.reply({ embeds: [emb] }).then(msg2 => {
                            setTimeout(() => msg2.delete(), 30000);
                        })
                    })
                } else {
                    message.reply({ embeds: [emb] }).then(msg1 => {
                        setTimeout(() => msg1.delete(), 30000);
                    })
                }
            })
        } catch (error) {
            message.reply('An error happen, thanks to contact Yweelon as soon as possible').then(msg => { setTimeout(() => msg.delete(), client.configuration.cmd.timeout); })
            console.log('[commands/' + __filename.split('/')[__filename.split('/').length - 1].replace('.js', '') + '] L\'erreur suivante à pop :\n' + error.message + '\n\nà cause du message suivant : ' + message.content + ' (par ' + message.author.tag + ')')
        }
    }
}

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
