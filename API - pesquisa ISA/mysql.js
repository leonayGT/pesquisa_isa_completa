var mysql = require('mysql2')

var pool = mysql.createPool({
    host: 'localhost',
    user: 'leonaygt',
    password: '123456',
    database: 'leonay',
    port: 3306,
});


module.exports = { pool }