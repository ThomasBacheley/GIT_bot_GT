var getBddConnection = require('./getBddConnection')

module.exports = async function (weapon_name, weapon_type) {
    try {
        return new Promise((resolve, reject) => {
            try {
                getBddConnection().then((connection) => {
                    connection.connect();
                    connection.query('SELECT id FROM `ex_weapon` WHERE name LIKE \'%' + weapon_name + '%\'',
                        async function (error, results, fields) {
                            if (error) { console.log(error); resolve(null) }
                            if (results[0] == undefined) { //il n'y a pas d'arme de ce nom
                                connection.query('SELECT emote_type FROM `ex_weapon` WHERE emote_type LIKE \'%' + weapon_type + '%\'',
                                    async function (error, results, fields) {
                                        if (error) { console.log(error); resolve(null) };
                                        if (results[0].emote_type != '') {
                                            connection.query('INSERT INTO `ex_weapon`(`name`,`link`,`type`,`emote_type`) VALUES (?,?,?,?)',
                                                [weapon_name, `https://heavenhold.com/items/${weapon_name.replace(' ', '-').replace(' ', '-').replace(' ', '-').replace(' ', '-').replace(' ', '-').toLowerCase()}/`, weapon_type, results[0].emote_type],
                                                async function (error, results, fields) {
                                                    if (error) { console.log(error); resolve(null) }
                                                    else {
                                                        connection.query('SELECT id FROM `ex_weapon` WHERE name LIKE \'%' + weapon_name + '%\'',
                                                            async function (error, results, fields) {
                                                                if (error) { console.log(error); resolve(null) }
                                                                else {
                                                                    if (results[0].id != '') {
                                                                        console.log(weapon_name + ' Ajouter à la BDD')
                                                                        resolve(results[0].id)
                                                                    } else {
                                                                        resolve(null)
                                                                    }
                                                                }
                                                            })
                                                    }
                                                }
                                            )
                                        } else {
                                            resolve(null);
                                        }
                                    })
                            } else {
                                resolve(null)
                            }
                        })
                })
            } catch (error) {
                reject(error)
            }
        });
    } catch (error) {
        throw error
    }
}

