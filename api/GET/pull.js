const router = require('express').Router();

var summon = require('../../functions/summon')

router.get('/', async (req, res) => {
    if(req.query.multi == 'false'){
        summon(undefined,false).then(r=>res.send(r))
    }else{
        summon().then(r=>res.send(r))
    }
});

module.exports = router
