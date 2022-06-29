const mysql = require('mysql2');

const pool = mysql.createPool({
    host: "localhost",
    user: 'root',
    database: 'node-complete',
    password: '< Enter your password here >'
});

module.exports = pool.promise();