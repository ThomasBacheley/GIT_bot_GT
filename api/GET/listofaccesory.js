const router = require('express').Router();

var getBddConnection = require('../../functions/getBddConnection')

router.get('/', async (req, res) => {
    getBddConnection().then((connection) => {
        connection.connect()
        connection.query('SELECT name FROM `accesory_item` ORDER BY FIELD(color,"green","yellow","orange")',
            async function (error, results, fields) {
                if (error) console.log(error)
                else {
                    var arr = results.map(r=>r.name)
                    res.send(arr)
                }
            });
    })
});

module.exports = router