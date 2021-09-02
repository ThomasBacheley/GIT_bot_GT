const router = require('express').Router();

var getBddConnection = require('../functions/getBddConnection')

router.get('/', async (req, res) => {
    getBddConnection().then((connection) => {
        connection.connect()
        connection.query('SELECT name,color FROM `accesory_item` ORDER BY FIELD(color,"green","yellow","orange")',
            async function (error, results, fields) {
                if (error) console.log(error)
                else {
                    res.send(results)
                }
            });
    })
});

module.exports = router