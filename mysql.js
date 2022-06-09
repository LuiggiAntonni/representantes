const dotenv = require('dotenv').config()
var mysql = require('mysql');

var pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database : 'representante',
});

exports.pool = pool;