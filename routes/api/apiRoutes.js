const express = require('express');
const app = express();
const router = express.Router();
const mysql = require('../../mysql').pool;
const bodyParser = require('body-parser');
const multer = require('multer');
const multerConfig = require('../../config/multer')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

router.get('/email', async (req, res, next) => {
    var email = req.body.email
    await emailExists(email, function (err, isExists) {
        if (err) {
            return res.status(500).send({
                mensagem: 'Error ao procurar o email'
            })
        } else {
            if (isExists) {
                return res.status(200).send({
                    mensagem: `${email} existe`,
                    email: email,
                    token: 0
                })
            } else {
                return res.status(404).send({
                    mensagem: `${email} não existe`
                })
            }
        }
    });
})

router.get('/catalogo/:email', (req, res) => {
    const email = req.params.email

    var sql = `SELECT * FROM catalogo WHERE email_FK = ${mysql.escape(email)}`;
    mysql.getConnection((err, conn) => {
        if (err) throw err;
        conn.query(sql, (err, result) => {
            if (err) {
                return res.send({
                    mensagem: 'Erro ao carregar catalogo',
                    err: err
                })
            }
            return res.send(result)
        })
        conn.release()
    })

})

router.get('/catalogo/:email/:id', (req, res) => {
    const email = req.params.email
    const id = req.params.id

    var sql = `SELECT * FROM catalogo WHERE email_FK = ${mysql.escape(email)} AND CatalogoID = ${mysql.escape(id)}`;
    mysql.getConnection((err, conn) => {
        if (err) throw err;
        conn.query(sql, (err, result) => {
            if (err) {
                return res.send({
                    mensagem: 'Erro ao carregar catalogo',
                    err: err
                })
            }
            return res.send(result)
        })
        conn.release()
    })

})

router.post('/criarcatalogo', multer(multerConfig).single('imagem'), (req, res) => {
    const email = req.user._json.email
    const data = req.body
    const ano = data.ano != null ? data.ano : Date.now;
    const imagem = req.file.filename
    console.log(data)
    if (email === data.email) {
        var sql = `INSERT INTO catalogo (email_FK, name, ano, imagem) VALUES (${mysql.escape(email)}, ${mysql.escape(data.nome)}, ${mysql.escape(data.ano)}, ${mysql.escape(imagem)})`;
        mysql.getConnection((err, conn) => {
            if (err) throw err;
            conn.query(sql, (err, result) => {
                if (err) {
                    return res.send({
                        mensagem: 'Erro ao salvar conteudo',
                        err: err
                    })
                }
                return res.redirect(`/rep/catalogo/${email}/${result.insertId}`)
            })
            conn.release()
        })
    } else {
        res.sendStatus(401).send({
            mensagem: 'Error'
        })
    }
})

async function emailExists(email, callback) {
    var sql = `SELECT email FROM email WHERE email = ${mysql.escape(email)}`;
    mysql.query(sql, function (err, result) {
        callback(err, result ? result.length > 0 : false);
    });
}

module.exports = router;