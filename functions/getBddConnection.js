require('dotenv').config();

module.exports = async (db_name = 'guardiantale') => {
    try {
        return new Promise((resolve, reject) => {
            try {
                var mysql = require('mysql');
                var connection = mysql.createConnection({
                    host: 'localhost',
                    user: process.env.SQL_USERNAME,
                    password: process.env.SQL_PSWD,
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