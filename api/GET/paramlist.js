const router = require('express').Router();

var getBddConnection = require('../../functions/getBddConnection')

var params_wanted = [
    "name",
    "nickname",
    "type",
    "role",
    "shield",
    "accesory",
    "cards",
    "merch_item",
    "hero_pic",
    "pp_link",
    "hero_link",
    "party_buff"
]

router.get('/', async (req, res) => {
    getBddConnection().then((connection) => {
        connection.connect()
        connection.query('SELECT * FROM `heroes` WHERE id = ?', [1],
            async function (error, results, fields) {
                if (error) console.log(error)
                else {
                    var arr = await fields.filter(field => params_wanted.includes(field.name)).map(field => field.name);
                    res.send(arr)
                }
            });
    })
});

module.exports = router