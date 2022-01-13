module.exports = {
    name: __filename.split('/')[__filename.split('/').length - 1].replace('.js', ''),
    enable: true,
    description: 'CBM for **C**lear **B**ot\'s **M**essage',
    usage: '!cbm <nbr_of_message>',
    async run(client, message, args) {
        try {
            let msg_cmd = message
            if (client.configuration.admin.includes(message.author.id)) {
                if (!isNaN(args[0])) {
                    let temp_nbr = 0;
                    message.channel.messages.fetch().then(messages=>{
                        messages.forEach(message=>{
                            if(message.author.id == client.user.id){
                                if((temp_nbr+1)<=parseInt(args[0])){
                                    temp_nbr++;
                                    setTimeout(() => message.delete(), 1000);
                                }
                                if(temp_nbr==parseInt(args[0])){
                                    setTimeout(() => msg_cmd.delete(), client.configuration.cmd.timeout);
                                    message.reply(temp_nbr+' message(s) deleted').then(msg => { setTimeout(() => msg.delete(), 10000); })
                                }
                            }
                        })
                    })
                } else {
                    message.reply('you didn\'t give a number').then(msg => { setTimeout(() => msg.delete(), 30000); })
                }
            } else {
                message.reply('You\'re not a Admin').then(msg => { setTimeout(() => msg.delete(), 30000); })
            }
        } catch (error) {
            message.reply('An error happen, thanks to contact Yweelon as soon as possible').then(msg => { setTimeout(() => msg.delete(), 30000); })
            console.log('[commands/' + __filename.split('/')[__filename.split('/').length - 1].replace('.js', '') + '] L\'erreur suivante à pop :\n' + error.message + '\n\nà cause du message suivant : ' + message.content + ' (par ' + message.author.tag + ')')
        }
    }
}
