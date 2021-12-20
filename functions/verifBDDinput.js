var word = [
    'truncate',
    'drop',
    'create',
    'user'
]

module.exports = async function (query_value) {
    try {
        let lock = false
        query_value.forEach(val => {
            if(lock) { return }
            word.forEach(w => {
                if(lock) { return }
                if (val.toLowerCase().search(w) != -1) {
                    lock = true;
                    return true;
                }
            })
        })
        return false;
    } catch (error) {
        throw error
    }
}