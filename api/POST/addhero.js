const router = require('express').Router();
var { DateTime } = require('luxon')

var getBddConnection = require('../../functions/getBddConnection')

router.post('/', async (req, res) => {
    var hero = req.body;
    if (hero.ex_weapon_name == '' || hero.ex_weapon_type == 'NULL') {
        res.send('You didn\'t provide a ex weapon name or a ex weapon type')
    } else {
        getBddConnection().then((connection) => {
            connection.connect()
            //#region Part 1 → add Ex weapon
            //--- on verifie si l'arme existe pas déja
            connection.query('SELECT id FROM `ex_weapon` WHERE name LIKE \'%' + hero.ex_weapon_name.replace('\'', '').replace('\'', '') + '%\'',
                async function (error, results, fields) {
                    if (error) console.log(error)
                    else {
                        if (results[0]) {
                            res.send('This Weapon is already in the DataBase !')
                        }
                    }
                })
            //----------
            connection.query('SELECT emote_type FROM `ex_weapon` WHERE emote_type LIKE \'%' + hero.ex_weapon_type.replace('\'', '').replace('\'', '') + '%\'',
                async function (error, results, fields) {
                    if (error) console.log(error)
                    else {
                        connection.query('INSERT INTO `ex_weapon`(`name`,`link`,`type`,`emote_type`) VALUES (?,?,?,?)',
                            [hero.ex_weapon_name, `https://heavenhold.com/items/${hero.ex_weapon_name.replace(' ', '-').replace(' ', '-').replace(' ', '-').replace(' ', '-').replace(' ', '-').toLowerCase()}/`, hero.ex_weapon_type, results[0].emote_type],
                            async function (error, results, fields) {
                                if (error) console.log(error)
                                else {
                                    console.log(hero.ex_weapon_name + ' Ajouter à la BDD')
                                    results = null
                                }
                            }
                        )
                    }
                })
            //#endregion
            //#region Part 2 → add Hero
            connection.query('SELECT id FROM `heroes` WHERE name LIKE ?', [hero.hero_name],
                async function (error, results, fields) {
                    if (error) console.log(error)
                    else {
                        if (results[0]) {
                            res.send('This Hero is already in the DataBase !')
                        } else {
                            connection.query('INSERT INTO `heroes`(`name`, `type`, `role`, `weapon`, `shield`, `accesory`, `cards`, `merch_item`, `hero_pic`, `pp_link`, `hero_link`) VALUES (?,(SELECT id from hero_type WHERE hero_type.type = ?),(SELECT id from hero_role WHERE hero_role.role = ?),(SELECT id from ex_weapon WHERE ex_weapon.name = ?),(SELECT id from shield_item WHERE shield_item.name = ?),(SELECT id from accesory_item WHERE accesory_item.name = ?),?,(SELECT id from merch_item WHERE merch_item.name=?),?,?)',
                                [hero.hero_name, hero.hero_type, hero.hero_role, hero.ex_weapon_name, hero.shield_name, hero.accesory_name, hero.cards_name, hero.merchitem_name, hero.hero_pic, hero.pp_link, hero.hero_link],
                                function (error, results, fields) {
                                    if (error) console.log(error)
                                    else {
                                        let complement = ''
                                        if (req.body.username != '') { complement += ` par ${req.body.username}` }
                                        console.log(hero.hero_name + ' ajouter à la base de données le ' + DateTime.now().toFormat('dd/LLL- HH:mm') + complement + '!')
                                        res.sendFile('/home/pi/GIT_bot_GT/success_page.html')
                                    }
                                });
                        }
                    }
                });
            //#endregion
        });
    }
});

module.exports = router