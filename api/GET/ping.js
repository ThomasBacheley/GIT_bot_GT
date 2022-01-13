var ping = require('ping')

const router = require('express').Router();

router.get('/', async (req, res) => {
        let ping_res = await ping.promise.probe('google.com',{
           timeout: 10,
           extra: ['-i', '2'],
       });
        res.send(ping_res)
})

module.exports = router