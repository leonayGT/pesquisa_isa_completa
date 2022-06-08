const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const mysql = require('../mysql').pool

var nome
var associacao
var email
var protocolo

router.post('/send', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({ error: error })
        }
        conn.query(
            'INSERT INTO pesquisa_isa (nome_usu,associ,email_usu) values (?,?,?)',
            [req.body.nome_usu, req.body.associ, req.body.email_usu],
            (error, result, fields) => {
                if (error) {
                    return res.status(500).send({ error: error })
                }
                const response = {
                    mensagem: 'Pesquisa Criada',
                    pesquisa_criada: {
                        protocolo: result.insertId,
                        nome_usu: req.body.nome_usu,
                        associcao: req.body.associ,
                        email_associado: req.body.email_usu,
                        request: {
                            tipo: 'GET',
                            descricao: 'Envia o email da pesquisa de satisfação',
                            url: 'http://localhost:3000/email'
                        }
                    }
                }
                nome = req.body.nome_usu
                associacao = req.body.associ
                email = req.body.email_usu
                protocolo = result.insertId

                console.log(nome, associacao, email, protocolo)
                return res.status(200).send({ response })
            }
        )
    })
})

router.post("/", (req, res, next) => {
    var transport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
            user: "leonaygt2019@gmail.com",
            pass: "dlvoalzpmgejvqsq"
        }
    })
    var message = {
        from: "leonaygt2019@gmail.com",
        to: email,
        subject: `Pesquisa de satisfação do evento do protocolo ${protocolo}`,
        text: `Prezado(a) ${nome}. \n\nVocê solicitou alteração de senha.\n\n`,
        html: `<!DOCTYPE html>
        <html lang="en">

        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Document</title>
            <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet"
                integrity="sha384-0evHe/X+R7YkIZDRvuzKMRqM+OrBnVFBL6DOitfPri4tjfHxaWutUpFmBp4vmVor" crossorigin="anonymous">
        </head>
        <body>
            <div class="container">
                <div class="row mt-3">
                    <img src="/API - pesquisa ISA/carro.jpg"" alt="" class="img-fluid mx-3"
                        style="height: 100px; width:400px; border:1px solid #d6dbe0; border-radius: 10px;">
            </div>
                <div class="row">
                    <div class="col-md-12">
                        <h1>Olá ${nome}</h1>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-5">
                        <p style="background-color: black; color: white;">Este email é referente ao evento da associcação
                        <span style="color:rgb(20, 212, 20);">${associacao}</span> do protocolo <span
                            style="color:rgb(20, 212, 20);"> ${protocolo}</span></p>
                    </div>
                </div>
                <p>Agradecemos a preferência.</p>
                <p>Para realizar a pesquisa de satisfação clique <a href="http://127.0.0.1:5500/Pesquisa-isa.html?protocolo=${protocolo}&associacao=${associacao}&nome=${nome}">aqui</a></p>
            </div>
        </body>
        </html>`
    }
    transport.sendMail(message, (err) => {
        if (err) return res.status(400).json({
            erro: true,
            mensagem: "Erro: E-mail não enviado com sucesso!"
        })
    })
    return res.status(200).json({
        erro: false,
        mensagem: "E-mail enviado com sucesso!"
    })
})

router.patch('/', (req, res, next) => {
    mysql.getConnection((error, conn) => {
        if (error) {
            return res.status(500).send({ error: error })
        }
        conn.query(
            `UPDATE pesquisa_isa SET nome_usu = ?, associ = ?, atend_oficina = ?, comen_atend_oficina = ?,
                tempo = ?, comen_tempo = ?, reparo = ?, coment_reparo = ?, atend_associacao = ?, comen_atend_associacao = ?,
                conti_associ = ?, comen_conti_associ = ?, terceiro = ?, comen_terceiro = ?, indicacao = ?, comen_indicacao = ?,
                sugestao = ?, comen_sugestao = ?
                WHERE id_pesquisa = ?;`,
            [req.body.nome_usu, req.body.associ, req.body.atend_oficina, req.body.comen_atend_oficina,
            req.body.tempo, req.body.comen_tempo,
            req.body.reparo, req.body.coment_reparo, req.body.atend_associacao, req.body.comen_atend_associacao, req.body.conti_associ,
            req.body.comen_conti_associ, req.body.terceiro,
            req.body.comen_terceiro, req.body.indicacao, req.body.comen_indicacao, req.body.sugestao, req.body.comen_sugestao, req.body.id_pesquisa],
            (error, result, fields) => {
                conn.release()
                if (error) {
                    return res.status(500).send({
                        error: error,
                        response: null
                    })
                }
                const response = {
                    mensagem: 'Pesquisa atualizada com sucesso',
                    ProdutoAtualizado: {
                        id_produto: req.body.id_pesquisa,
                        nome: req.body.nome_usu,
                        preco: req.body.associ,
                        request: {
                            tipo: 'GET',
                            descricao: 'Retorna todos os produtos',
                            url: 'http://localhost:3000/produtos/' + req.body.id_produtos
                        }
                    }
                }
                res.status(202).send({ response })
            }
        )
    })
})
module.exports = router