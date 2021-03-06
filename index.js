const express = require('express');
const app = express();
const port = 3000;
const path = require('path')
const session = require('express-session')
const bodyParser = require('body-parser')
const dotenv = require('dotenv').config()
const server = app.listen(port, () => console.log('Server rodando na porta ' + port))
const mysql = require('mysql');
const pool = require('./mysql').pool;
const passport = require('passport')
require('./auth/passport')


var con = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD
});

con.connect(function (err) {
    if (err) throw err;
    console.log("Conectou ao banco de dados");

    con.query("CREATE DATABASE IF NOT EXISTS representante", function (err, result) {
        if (err) throw err;
        console.log("Database iniciada");
    });

    con.changeUser({
        database: 'representante'
    }, function (err) {
        if (err) throw err;
    });

    var sql = "CREATE TABLE IF NOT EXISTS email (emailID INT AUTO_INCREMENT PRIMARY KEY, email VARCHAR(255) NOT NULL UNIQUE)";
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log("Tabela Email iniciada");
    });

    var sql1 = "CREATE TABLE IF NOT EXISTS catalogo (CatalogoID INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255) NOT NULL, email_FK VARCHAR(255) NOT NULL, ano VARCHAR(255), imagem VARCHAR(300) DEFAULT \'semimagem.png\', FOREIGN KEY (email_FK) REFERENCES email (email))";
    con.query(sql1, function (err, result) {
        if (err) throw err;
        console.log("Tabela Catalogos iniciada");
    });

    var sql2 = "CREATE TABLE IF NOT EXISTS produtos (id INT AUTO_INCREMENT PRIMARY KEY, ref VARCHAR(255) NOT NULL, preco DECIMAL(15,2) NOT NULL, imagem VARCHAR(300) DEFAULT \'semimagem.png\', tamanhos VARCHAR(255) NOT NULL, cores VARCHAR(255) NOT NULL, catalogo_FK INT NOT NULL, FOREIGN KEY (catalogo_FK) REFERENCES catalogo (CatalogoID))";
    con.query(sql2, function (err, result) {
        if (err) throw err;
        console.log("Tabela Produtos iniciada");
    });
});

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
    secret: process.env.SESSION_SECRET,
    name: 'session',
    resave: false,
    saveUninitialized: true
}))
app.use(passport.initialize());
app.use(passport.session());


// Routes 
const mainRoute = require('./routes/mainRoutes');
const loginRoute = require('./routes/loginRoutes');
const authRoute = require('./routes/auth')
const repRoute = require('./routes/repRoutes')

// Api routes
const apiRoute = require('./routes/api/apiRoutes')

app.use('/api', apiRoute);

app.use('/rep', repRoute);

app.use('/login', loginRoute);

app.use('/auth', authRoute);

app.use('/', mainRoute);