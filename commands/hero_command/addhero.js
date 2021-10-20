var getBddconnection = require('../../functions/getBddConnection')

module.exports = {
    name: __filename.split('/')[__filename.split('/').length - 1].replace('.js', ''),
    description: 'to add info about a hero in database',
    usage: '!addhero {"name":"hero_name","role":"hero_role(Tank,MeleeDPS,RangeDPS,Support,Healer)","weapon":"hero weapon","shield":"NULL or hero shield name","accesory":"hero accesory","cards":"2x cards","merch_item":"hero merchitem","pp_link":"link to champion pfp","champion_link":"link to champion(heavenhold.com)"}',
    async run(client, message, args) {
        try {
            setTimeout(() => message.delete(), 3000);

            var hero = JSON.parse(args.join(' '));

            getBddconnection().then((connection) => {
                connection.connect()
                // connection.query('SELECT * FROM `heroes` WHERE `name` = \''+args.join(' ')+'\'',
                connection.query('INSERT INTO heroes (`name`,`type`,`role`,`weapon`,`shield`,`accesory`,`cards`,`merch_item`,`pp_link`,`champion_link`) VALUES (?,?,?,?,?,?,?,?,?,?)',
                [hero.name,hero.type,hero.role,hero.weapon,hero.shield,hero.accesory,hero.cards,hero.merch_item,hero.pp_link,hero.champion_link],
                    function (error, results, fields) {
                        if (error) console.log(error)
                        else {
                            message.reply(`Hero \`${hero.name}\` added to Database`).then(msg => { setTimeout(() => msg.delete(), 30000); })
                        }
                    });
            })

        } catch (error) {
            message.reply('An error happen, thanks to contact Yweelon as soon as possible').then(msg => { setTimeout(() => msg.delete(), 30000); })
            console.log('[commands/'+__filename.split('/')[__filename.split('/').length - 1].replace('.js', '')+'] L\'erreur suivante à pop :\n' + error.message + '\n\nà cause du message suivant : ' + message.content + ' (par ' + message.author.tag + ')')
        }
    }
}