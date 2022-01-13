var { DateTime } = require('luxon')
var { writeFile } = require('fs')

module.exports = async function (client) {
    try {
        var today = DateTime.now().toFormat('LLL dd');
        if (client.data.update_day == today) {
            updateday(client)
            updatepatch(client)
        }
        setInterval(() => {
            var today = DateTime.now().toFormat('LLL dd');
            if (client.data.update_day == today) {
                updateday(client)
                updatepatch(client)
            }
        }, 1 * 3600000)//1 hours
    } catch (error) {
        throw error
    }
}

async function updateday(client) {
    client.data.update_day = DateTime.now().plus({ weeks: 2 }).toFormat('LLL dd');
    var obj_data = JSON.stringify(client.data, '', '\t');
    writeFile('./data.json', obj_data, err => { if (err) { throw err; } });
    client.channels.cache.get('749900170417799209').send('It\'s Update Day !')
}

async function updatepatch(client) {
    setTimeout(() => {
        client.data.kr_patch_number = client.data.kr_patch_number + 1
        var obj_data = JSON.stringify(client.data, '', '\t');
        writeFile('./data.json', obj_data, err => { if (err) { throw err; } });
    }, 24 * 3600000) // 24h apres
}