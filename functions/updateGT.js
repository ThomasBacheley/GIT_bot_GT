var { DateTime } = require('luxon')
var { writeFile } = require('fs')

module.exports = async function (client) {
    try {
        var today = DateTime.now().toFormat('LLL dd');
        if (client.data.update_day == today) {
            client.data.update_day = DateTime.now().plus({ weeks: 2 }).toFormat('LLL dd');
            var obj_data = JSON.stringify(client.data, '', '\t');
            writeFile('./data.json', obj_data, err => { if (err) { throw err; } });
            client.channels.cache.get('749900170417799209').send('It\'s Update Day !')
        }
        setInterval(() => {
            var today = DateTime.now().toFormat('LLL dd');
            if (client.data.update_day == today) {
                client.data.update_day = DateTime.now().plus({ weeks: 2 }).toFormat('LLL dd');
                var obj_data = JSON.stringify(client.data, '', '\t');
                writeFile('./data.json', obj_data, err => { if (err) { throw err; } });
                client.channels.cache.get('749900170417799209').send('It\'s Update Day !')
            }
        }, 1 * 3600000)//1 hours
    } catch (error) {
        throw error
    }
}