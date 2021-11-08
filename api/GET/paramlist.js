const router = require('express').Router();

var getBddConnection = require('../../functions/getBddConnection')

router.get('/', async (req, res) => {
    getBddConnection().then((connection) => {
        connection.connect()
        connection.query('SELECT * FROM `heroes` WHERE id = ?', [1],
            async function (error, results, fields) {
                if (error) console.log(error)
                else {
                    var arr = await fields.filter(field => field.name != 'id' && field.name !='weapon').map(field => field.name);
                    res.send(arr)
                }
            });
    })
});

module.exports = router