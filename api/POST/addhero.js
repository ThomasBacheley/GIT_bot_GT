const router = require('express').Router();

var { DateTime } = require('luxon')

var verifBDDinput = require('../../functions/verifBDDinput')
var getBddConnection = require('../../functions/getBddConnection')
var addWeapon = require('../../functions/addWeapon.js')

router.post('/', async (req, res) => {
    var hero = req.body;
    if (hero.ex_weapon_name == '' || hero.ex_weapon_type == 'NULL') {
        res.send('You didn\'t provide a ex weapon name or a ex weapon type')
    } else {
        await addWeapon(hero.ex_weapon_name, hero.ex_weapon_type).then(id_exweapon => {
            if (id_exweapon != undefined || id_exweapon != null) {
                getBddConnection().then((connection) => {
                    connection.connect();
                    connection.query('SELECT id FROM `heroes` WHERE name LIKE ?', [hero.hero_name],
                        async function (error, results, fields) {
                            if (error) console.log(error)
                            else {
                                if (results[0]) {
                                    res.send('This Hero is already in the DataBase !')
                                } else {
                                    //#region construction query
                                    let query_obj = await query_build(hero, id_exweapon)
                                    // let r = await verifBDDinput(query_value);
                                    // if (r) { res.send('Bien joué , mais ça n\'as pas pété'); return }
                                    //#endregion
                                    connection.query(query_obj.query, query_obj.values,
                                        function (error, results, fields) {
                                            if (error) console.log(error)
                                            else {
                                                let complement = ''
                                                if (req.body.username != '') { complement += ` par ${req.body.username}` }
                                                console.log(hero.hero_name + ' ajouter à la base de données le ' + DateTime.now().toFormat('dd/LLL- HH:mm') + complement + '!')
                                                res.redirect(301, 'http://yweelon.fr/GT_addhero.php')
                                            }
                                        });
                                }
                            }
                        });
                })
            } else {
                res.send('An error happend, the weapon and the hero can\'t be added')
            }
        });
    }
});

async function query_build(hero, id_weapon) {
    try {
        var queryP1 = 'INSERT INTO `heroes`(`name`,`type`,`role`,`weapon`'
        var queryP2 = 'VALUES (?,(SELECT id from hero_type WHERE hero_type.type = ?),(SELECT id from hero_role WHERE hero_role.role = ?),?'

        var query_value = [
            hero.hero_name,
            hero.hero_type,
            hero.hero_role,
            id_weapon
        ]

        if (hero.shield_name != 'NULL') {
            queryP1 += ',`shield`'
            queryP2 += ',(SELECT id from shield_item WHERE shield_item.name = ?)'
            query_value.push(hero.shield_name)


        }


        if (hero.accesory_name != 'NULL') {



            queryP1 += ',`accesory`'



            queryP2 += ',(SELECT id from accesory_item WHERE accesory_item.name = ?)'



            query_value.push(hero.accesory_name)



        }







        if (hero.cards_name.toString() != '' || hero.cards_name.toString() != 'NULL') {



            queryP1 += ',`cards`';



            queryP2 += ',?'



            query_value.push(hero.cards_name.toString());



        }







        if (hero.merchitem_name != 'NULL') {



            queryP1 += ',`merch_item`'



            queryP2 += ',(SELECT id from merch_item WHERE merch_item.name = ?)'



            query_value.push(hero.merchitem_name)



        }







        if (hero.hero_pic.toString() != '') {



            queryP1 += ',`hero_pic`'



            queryP2 += ',?'



            query_value.push(hero.hero_pic.toString())



        }

        if(hero.collaboration){
            queryP1 += ',`collaboration`'
            queryP2 += ',1'
        }


        var q = queryP1 + ', `pp_link`, `hero_link`) ' + queryP2 + ',?,? )';



        query_value.push(hero.pp_link.toString());





        if (hero.hero_link == '' || hero.hero_link == 'NULL') {
            query_value.push('https://heavenhold.com/heroes/' + hero.hero_name.replace(' ', '-').replace(' ', '-').replace(' ', '-').replace(' ', '-'))
        } else {
            query_value.push(hero.hero_link)
        }







        return {

            query: q,

            values: query_value

        }



    } catch (error) {



        throw error



    }



}







module.exports = router






