const express = require('express');
const app = express();
const port = 3000;
const path = require('path')
const cookieSession = require('cookie-session')
const bodyParser = require('body-parser')
const dotenv = require('dotenv').config()
const server = app.listen(port, () => console.log('Server rodando na porta ' + port))
const mysql = require('mysql');

var con = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Conectou ao bano de dados");
});

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieSession({
    key: "keyDoSite",
    secret: process.env.SESSION_SECRET,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    },
}));

// Routes 
const mainRoute = require('./routes/mainRoutes');

app.use('/', mainRoute);