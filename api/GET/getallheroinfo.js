const router = require('express').Router();

var getBddConnection = require('../../functions/getBddConnection')

router.get('/', async (req, res) => {
    getBddConnection().then((connection) => {
        connection.connect()
        connection.query(`SELECT DISTINCT (name),pp_link from heroes ORDER BY name ASC`,
            async function (error, results, fields) {
                if (error) console.log(error)
                else {
                    res.send(results)
                }
            });
    })
});

module.exports = router