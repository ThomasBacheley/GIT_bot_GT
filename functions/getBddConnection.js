module.exports = async (db_name = 'guardiantale') => {
    try {
        return new Promise((resolve, reject) => {
            try {
                var mysql = require('mysql');
                var connection = mysql.createConnection({
                    host: 'localhost',
                    user: 'root',
                    password: 'jjE72Dak',
                    database: db_name,
                    charset: 'utf8mb4_unicode_ci'
                });
                resolve(connection)
            } catch (error) {
                reject(error)
            }
        });
    } catch (error) {
        throw error
    }
}