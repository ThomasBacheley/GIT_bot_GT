const router = require('express').Router();
var { DateTime } = require('luxon')

var getBddConnection = require('../../functions/getBddConnection')
var verifBDDinput = require('../../functions/verifBDDinput')

router.post('/', async (req, res) => {
    getBddConnection().then((connection) => {
        connection.connect()
        connection.query("SELECT id FROM heroes WHERE name = '" + req.body.select_hero + "'",
            async function (error, results, fields) {
                if (error) console.log(error)
                if (results.length == 0) {
                    res.send('It seems that hero doesn\'t exist in Database')
                } else {
                    let query = "UPDATE heroes SET " + req.body.select_param + " = ";
                    let r = await verifBDDinput([req.body.select_param, req.body.newvalue]);
                    if (r) { res.send('Bien joué , mais ça n\'as pas pété');return }
                    switch (req.body.select_param) {
                        case 'type':
                            query += "(SELECT id from hero_type WHERE type = '" + req.body.newvalue + "')";
                            break;
                        case 'role':
                            query += "(SELECT id from hero_role WHERE role = '" + req.body.newvalue + "')";
                            break;
                        case 'shield':
                            query += "(SELECT id from shield_item WHERE name = '" + req.body.newvalue + "')";
                            break;
                        case 'accesory':
                            query += "(SELECT id from accesory_item WHERE name = '" + req.body.newvalue + "')";
                            break;
                        case 'merch_item':
                            query += "(SELECT id from merch_item WHERE name = '" + req.body.newvalue + "')";
                            break;
                        default:
                            query += "'" + req.body.newvalue + "'";
                            break;
                    }
                    connection.query(`${query} WHERE name = '${req.body.select_hero}'`,
                        async function (error, results, fields) {
                            if (error) console.log(error)
                            else {
                                let complement = ''
                                if (req.body.username != '') { complement += ` par ${req.body.username}` }
                                console.log('Update le ' + DateTime.now().toFormat('dd/LLL- HH:mm') + complement + '\n', { "Hero": req.body.select_hero, "Parametre modifer": req.body.select_param, "Nouvelle valeur": req.body.newvalue });
                                res.redirect(301,'http://yweelon.fr/GT_updatehero.php')
                            }
                        });
                }
            })
    })
})

module.exports = router