const router = require('express').Router();

var getBddConnection = require('../../functions/getBddConnection');

router.get('/', async (req, res) => {
    let rep = {
        heroes_value: 0,
        items_value: 0,
        cmds_value: 0
    }

    getBddConnection().then((connection) => {
        connection.connect()
        connection.query(`SELECT COUNT(*) as 'heroes_value' from heroes`,
            async function (error, results, fields) {
                if (error) console.log(error)
                else {
                    rep.heroes_value = results[0].heroes_value
                    connection.query(`SELECT COUNT(*) as 'items_value' from ex_weapon`,
                        async function (error, results, fields) {
                            if (error) console.log(error)
                            else {
                                rep.items_value += results[0].items_value
                                connection.query(`SELECT COUNT(*) as 'items_value' from accesory_item`,
                                    async function (error, results, fields) {
                                        if (error) console.log(error)
                                        else {
                                            rep.items_value += results[0].items_value
                                            connection.query(`SELECT COUNT(*) as 'items_value' from shield_item`,
                                                async function (error, results, fields) {
                                                    if (error) console.log(error)
                                                    else {
                                                        rep.items_value += results[0].items_value
                                                        connection.query(`SELECT COUNT(*) as 'items_value' from merch_item`,
                                                            async function (error, results, fields) {
                                                                if (error) console.log(error)
                                                                else {
                                                                    rep.items_value += results[0].items_value
                                                                    res.send(rep)
                                                                }
                                                            })
                                                    }
                                                })
                                        }
                                    });
                            }
                        });
                }
            });
    })
});

module.exports = router