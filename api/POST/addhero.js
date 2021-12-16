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
                        if (results[0] == '') {
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
                                                    results = null;
                                                }
                                            }
                                        )
                                    }
                                })
                        }

                        //#region Part 2 → add Hero
                        connection.query('SELECT id FROM `heroes` WHERE name LIKE ?', [hero.hero_name],
                            async function (error, results, fields) {
                                if (error) console.log(error)
                                else {
                                    if (results[0]) {
                                        res.send('This Hero is already in the DataBase !')
                                    } else {
                                        //#region construction query
                                        var queryP1 = 'INSERT INTO `heroes`(`name`,`type`,`role`,`weapon`'
                                        var queryP2 = '(?,(SELECT id from hero_type WHERE hero_type.type = ?),(SELECT id from hero_role WHERE hero_role.role = ?),(SELECT id from ex_weapon WHERE ex_weapon.name = ?)'
                                        var query_value = [
                                            hero.hero_name,
                                            hero.hero_type,
                                            hero.hero_role,
                                            hero.ex_weapon_name
                                        ]
                                        if(hero.shield_name!='NULL'){
                                            queryP1+=',`shield`'
                                            queryP2+=',(SELECT id from shield_item WHERE shield_item.name = ?)'
                                            query_value.push(hero.shield_name)
                                        }
                                        if(hero.accesory_name!='NULL'){
                                            queryP1+=',`accesory`'
                                            queryP2+=',(SELECT id from accesory_item WHERE accesory_item.name = ?)'
                                            query_value.push(hero.accesory_name)
                                        }
                                        queryP1+=',`cards`';
                                        queryP2+=',?'
                                        query_value.push(hero.cards_name.toString());
                                        if(hero.merchitem_name!='NULL'){
                                            queryP1+=',`merch_item`'
                                            queryP2+=',(SELECT id from merch_item WHERE merch_item.name = ?)'
                                            query_value.push(hero.merchitem_name)
                                        }
                                        var q = queryP1+',`hero_pic`, `pp_link`, `hero_link`) VALUES ' + queryP2+',?,?,? )';

                                        query_value.push(hero.hero_pic.toString());
                                        query_value.push(hero.pp_link.toString());

                                        if(hero.hero_link=='' || hero.hero_link=='NULL') {
                                            query_value.push('https://heavenhold.com/heroes/'+hero.hero_name.replace(' ','-').replace(' ','-').replace(' ','-').replace(' ','-'))
                                        }else{
                                            query_value.push(hero.hero_pic.toString());
                                        }
                                        

                                        //#endregion
                                        connection.query(q,query_value,
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
                    }
                })
            //----------
            //#endregion
        });
    }
});

module.exports = router