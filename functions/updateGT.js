var { DateTime } = require('luxon')
var { writeFile } = require('fs')

module.exports = async function (client) {
    try {
        setInterval(() => {
            var today = DateTime.now().toISO();
            if (client.data.update_day == today) {
                client.data.update_day = DateTime.now().plus({ weeks: 2 }).toISO();
                var obj_data = JSON.stringify(client.data, '', '\t');
                writeFile('./data.json', obj_data, err => { if (err) { throw err; } });
                client.channels.cache.get('812044534069723206').send('<@&749364889134563430>, It\'s Update Day !')
            }
        }, 86400000)//1 jour
    } catch (error) {
        throw error
    }
}