const router = require('express').Router();

var getBddConnection = require('../../functions/getBddConnection')

router.get('/:heroname', async (req, res) => {
    getBddConnection().then((connection) => {
        connection.connect()
        connection.query(`SELECT DISTINCT heroes.name,ex_weapon.name as 'ex_weapon',hero_type.type,hero_role.role,hero_pic,pp_link,hero_link,party_buff.value as 'party_buff',accesory_item.name as 'accesory_item' from heroes LEFT JOIN ex_weapon ON heroes.weapon=ex_weapon.id LEFT JOIN hero_type ON heroes.type = hero_type.id LEFT JOIN hero_role ON heroes.role = hero_role.id LEFT JOIN accesory_item ON heroes.accesory = accesory_item.id LEFT JOIN party_buff ON heroes.party_buff = party_buff.id WHERE heroes.name LIKE '%${req.params.heroname}%'`,
            async function (error, results, fields) {
                if (error) console.log(error)
                else {
                    if(results[0]){
                        res.send(results[0])
                    }else{
                        res.send(false)
                    }
                }
            });
    })
});

module.exports = router