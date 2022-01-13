
var getBddconnection = require('./getBddConnection');

module.exports = async (message = undefined,multi = true) => {
    try {
        return new Promise(async (resolve, reject) => {
            try {
                let lock = true
                let resultat = {
                    drop: {
                        one_star: 0,
                        two_star: 0,
                        three_star: 0
                    },
                    multi: []
                };
                let nbr_hero = 41
                if(multi){
                    for (i = 1; i < 11; i++) {
                        let r = await drop();
                        switch (r) {
                            case 3:
                                if (lock && message) {
                                    message.reply({ files: ['./assets/summon.gif'] }).then(msg => { resultat.msggif = msg })
                                    lock = false
                                }
                                resultat.drop.three_star += 1
                                let hero_pull = await pullx1(nbr_hero)
                                getBddconnection().then((connection) => {
                                    connection.connect()
                                    connection.query(`SELECT name,hero_pic,pp_link FROM heroes WHERE id = '` + hero_pull + `' and fanmade = 'false' LIMIT 1`,
                                        function (error, results, fields) {
                                            if (error) console.log(error)
                                            else {
                                                resultat.multi.push(results[0]);
                                                if (resultat.multi.length >= 10) {
                                                    resolve(resultat)
                                                }
                                            }
                                        });
                                })
                                break;
                            case 2:
                                resultat.drop.two_star += 1
                                resultat.multi.push({ brut: '2 star', dsc: '<:blue_star:929764831576334396><:blue_star:929764831576334396>' })
                                if (resultat.multi.length >= 10) {
                                    resolve(resultat)
                                }
                                break;
                            default:
                                resultat.drop.one_star += 1
                                resultat.multi.push({ brut: '1 star', dsc: ':star:' })
                                if (resultat.multi.length >= 10) {
                                    resolve(resultat)
                                }
                                break;
                        }
                    }
                }else{   
                    let r = await drop();
                    switch (r) {
                        case 3:
                            if (lock && message) {
                                message.reply({ files: ['./assets/summon.gif'] }).then(msg => { resultat.msggif = msg })
                                lock = false
                            }
                            resultat.drop.three_star += 1
                            let hero_pull = await pullx1(nbr_hero)
                            getBddconnection().then((connection) => {
                                connection.connect()
                                connection.query(`SELECT name,hero_pic,pp_link FROM heroes WHERE id = '` + hero_pull + `' and fanmade = 'false' LIMIT 1`,
                                    function (error, results, fields) {
                                        if (error) console.log(error)
                                        else {
                                            resultat.multi.push(results[0]);
                                            resolve(resultat)
                                        }
                                    });
                            })
                            break;
                        case 2:
                            resultat.drop.two_star += 1
                            resultat.multi.push({ brut: '2 star', dsc: '<:blue_star:929764831576334396><:blue_star:929764831576334396>' })
                            resolve(resultat)
                            break;
                        default:
                            resultat.drop.one_star += 1
                            resultat.multi.push({ brut: '1 star', dsc: ':star:' })
                            resolve(resultat)
                            break;
                    }
                
                }
            } catch (error) {
                reject(error)
            }
        });
    } catch (error) {
        throw error
    }
}

async function drop() {
    var taux_drop = 100
    taux_drop = (Math.random() * 101).toFixed(2)
    if (taux_drop <= 2.75) {
        return 3
    }
    if (taux_drop <= 19) {
        return 2
    }
    return 1
}

async function pullx1(max) {
    return Math.floor(Math.random() * max) + 1;
}
