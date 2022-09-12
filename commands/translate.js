const {Translate} = require('@google-cloud/translate').v2;
require('dotenv').config();
let projectId = process.env.GOOGLE_PROJECTID
const translate = new Translate({projectId});

module.exports = {
    name: __filename.split('/')[__filename.split('/').length - 1].replace('.js', ''),
    enable:false,
    description: 'help to translate',
    usage: '!translate <sentence>',
    async run(client, message, args) {
        try {
            setTimeout(() => message.delete(), 3000);
            const [translation] = await translate.translate(args.join(' '), 'en');
            message.reply(translation)
            } catch (error) {
            message.reply('An error happen, thanks to contact Yweelon as soon as possible').then(msg => { setTimeout(() => msg.delete(), client.configuration.cmd.timeout); })
            console.log('[commands/'+__filename.split('/')[__filename.split('/').length - 1].replace('.js', '')+'] L\'erreur suivante à pop :\n' + error.message + '\n\nà cause du message suivant : ' + message.content + ' (par ' + message.author.tag + ')')
        }
    }
}