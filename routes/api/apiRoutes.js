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

router.get('/produtos/:email/:id', (req, res) => {
    //Comparar o email da sessão com o dono do produto
    //const email = req.params.email
    const id = req.params.id

    var sql = `SELECT * FROM produtos WHERE catalogo_FK = ${mysql.escape(id)}`;
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
    const ano = data.ano == null ? data.ano : Date.now();
    const imagem = req.file.filename
    if (email === data.email) {
        var sql = `INSERT INTO catalogo (email_FK, name, ano, imagem) VALUES (${mysql.escape(email)}, ${mysql.escape(data.nome)}, ${mysql.escape(dataFormatada(Date(ano)))}, ${mysql.escape(imagem)})`;
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

router.post('/produto', multer(multerConfig).single('imagem'), async (req, res) => {
    const imagem = req.file.filename
    try {
        const data = req.body
        const email = req.user._json.email
        await emailBelongCatalogo(email, data.catalogo, function (err, isBelong) {
            if (err) {
                return res.status(500).send({
                    mensagem: 'Algum erro ao cadastrar'
                })
            } else {
                if (isBelong) {
                    console.log(data)
                    var sql = `INSERT INTO produtos (ref, preco, imagem, tamanhos, cores, catalogo_FK) VALUES (${mysql.escape(data.ref)}, ${mysql.escape(data.preco)}, ${mysql.escape(imagem)}, ${mysql.escape(data.tamanhos)}, ${mysql.escape(data.cores)},${mysql.escape(data.catalogo)})`;
                    mysql.getConnection((err, conn) => {
                        if (err) throw err;
                        conn.query(sql, (err, result) => {
                            if (err) {
                                return res.send({
                                    mensagem: 'Erro ao salvar conteudo',
                                    err: err
                                })
                            }
                            return res.redirect(`/rep/catalogo/${email}/${data.catalogo}`)
                        })
                        conn.release()
                    })
                } else {
                    return res.sendStatus(401);
                }
            }
        });
    } catch (error) {
        console.log("Deletar: ", imagem);
        return res.sendStatus(401);
    }
})

//Clonar produto
router.put('/produto/:email/:catalogo/:produto', async (req, res) => {
    try {
        if (req.user._json.email != req.params.email) return res.sendStatus(401);
        const email = req.user._json.email
        const produto = req.params.produto
        const catalogo = req.params.catalogo
        await emailBelongCatalogo(email, catalogo, function (err, isBelong) {
            if (err) {
                return res.status(500).send({
                    mensagem: 'Algum erro ao cadastrar'
                })
            } else {
                if (isBelong) {
                    var sql = `INSERT INTO produtos (ref, preco, imagem, tamanhos, cores, catalogo_FK) SELECT ref,preco,imagem,tamanhos,cores,catalogo_FK FROM produtos WHERE id = ${mysql.escape(produto)}`;
                    mysql.getConnection((err, conn) => {
                        if (err) throw err;
                        conn.query(sql, (err, result) => {
                            if (err) {
                                return res.send({
                                    mensagem: 'Erro ao clonar conteudo',
                                    err: err
                                })
                            }
                            return res.send({
                                mensagem: 'Clonado com sucesso'
                            })
                        })
                        conn.release()
                    })
                } else {
                    return res.sendStatus(401);
                }
            }
        });
    } catch (error) {
        return res.sendStatus(401);
    }
})

router.delete('/produto/:email/:catalogo/:produto', async (req, res) => {
    try {
        if (req.user._json.email != req.params.email) return res.sendStatus(401);
        const email = req.user._json.email
        const produto = req.params.produto
        const catalogo = req.params.catalogo
        await emailBelongCatalogo(email, catalogo, function (err, isBelong) {
            if (err) {
                return res.status(500).send({
                    mensagem: 'Algum erro ao deletar'
                })
            } else {
                if (isBelong) {
                    var sql = `DELETE FROM produtos WHERE id = ${mysql.escape(produto)}`;
                    mysql.getConnection((err, conn) => {
                        if (err) throw err;
                        conn.query(sql, (err, result) => {
                            if (err) {
                                return res.send({
                                    mensagem: 'Erro ao clonar conteudo',
                                    err: err
                                })
                            }
                            return res.send({
                                mensagem: 'Produto deletado com sucesso'
                            })
                        })
                        conn.release()
                    })
                } else {
                    return res.sendStatus(401);
                }
            }
        });
    } catch (error) {
        return res.sendStatus(401);
    }
})

router.post('/produto/mudarcor', async (req, res) => {
    try {
        const email = req.user._json.email
        const produto = req.body.produto
        const catalogo = req.body.catalogo
        const cores = req.body.cores
        await emailBelongCatalogo(email, catalogo, function (err, isBelong) {
            if (err) {
                return res.status(500).send({
                    mensagem: 'Algum erro ao salvar'
                })
            } else {
                if (isBelong) {
                    var sql = `UPDATE produtos SET cores = ${mysql.escape(cores)} WHERE id = ${mysql.escape(produto)}`;
                    console.log(sql)
                    mysql.getConnection((err, conn) => {
                        if (err) throw err;
                        conn.query(sql, (err, result) => {
                            if (err) {
                                return res.send({
                                    mensagem: 'Erro ao salvar conteudo',
                                    err: err
                                })
                            }
                            return res.send({
                                mensagem: 'Cores atualizadas com sucesso'
                            })
                        })
                        conn.release()
                    })
                } else {
                    return res.sendStatus(401);
                }
            }
        });
    } catch (error) {
        return res.sendStatus(500);
    }
})

async function emailBelongCatalogo(email, catalogo, callback) {
    var sql = `SELECT email_FK FROM catalogo WHERE CatalogoID = ${catalogo}`;
    mysql.getConnection((err, conn) => {
        if (err) throw err;
        conn.query(sql, (err, result) => {
            callback(err, result ? result[0].email_FK === email : false);
        })
        conn.release()
    })
}

function dataFormatada(valor) {
    var data = new Date(valor),
        mes = (data.getMonth() + 1).toString(),
        mesF = (mes.length == 1) ? '0' + mes : mes,
        anoF = data.getFullYear();
    return mesF + "/" + anoF;
}

module.exports = router;