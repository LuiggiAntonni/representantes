const express = require('express');
const app = express();
const router = express.Router();
const mysql = require('../../mysql').pool;

router.get('/email', async (req, res, next) => {
    var email = req.body.email
    await emailExists(email, function (err, isExists) {
        if (err) {
            return res.status(500).send({
                mensagem: 'Error ao procurar o email'
            })
        } else {
            if(isExists){
                return res.status(200).send({
                    mensagem: `${email} existe`,
                    email: email,
                    token: 0
                })
            }
            else{
                return res.status(404).send({
                    mensagem: `${email} não existe`
                })
            }
        }
    });
})
// //colocar para só aceitar autenticados
// router.put('/email/criar', (req, res, next) => {
//     var email = req.body.email
//     criarEmail(email, res)
// })

async function emailExists(email, callback) {
    var sql = `SELECT email FROM email WHERE email = ${mysql.escape(email)}`;
    mysql.query(sql, function (err, result) {
        callback(err, result ? result.length > 0 : false);
    });
}

// async function criarEmail(email, res) {
//     await emailExists(email, function (err, isExists) {
//         if (err) {
//             console.log(err);
//             return res.status(500).send({
//                 mensagem: 'Error ao procurar o email'
//             })
//         } else {
//             if(!isExists){
//                 mysql.getConnection((err, con) => {
//                     if (err) throw err;
//                     const query = `INSERT IGNORE INTO email (email) VALUES (${mysql.escape(email)})`
//                     con.query(query, function (err, result) {
//                         con.release();
//                         if (err) {
//                             return res.status(500).send({
//                                 error: err,
//                                 mensagem: 'Erro ao criar o email'
//                             })
//                         }
//                         response = {
//                             mensagem: 'Email cridado com sucesso',
//                             email: email
//                         }
//                         return res.status(201).send(response)
//                     })
//                 })
//             }
//             else{
//                 return res.status(200).send({
//                     mensagem: `${email} já existe`,
//                     email: email,
//                 })
//             }
//         }
//     });
// }

module.exports = router;