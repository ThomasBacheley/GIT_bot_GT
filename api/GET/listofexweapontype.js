const router = require('express').Router();

var getBddConnection = require('../../functions/getBddConnection')

router.get('/', async (req, res) => {
    getBddConnection().then((connection) => {
        connection.connect()
        connection.query('SELECT DISTINCT type FROM `ex_weapon`',
            async function (error, results, fields) {
                if (error) console.log(error)
                else {
                    var arr = results.map(r=>r.type)
                    res.send(arr)
                }
            });
    })
});

module.exports = router