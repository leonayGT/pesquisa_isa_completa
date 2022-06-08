const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
router.get("/", (req, res) => {
    var transport = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure:true,
        auth: {
            user: "leonaygt2019@gmail.com",
            pass: "dlvoalzpmgejvqsq"
        }
    })
    var message = {
        from: "leonaygt2019@gmail.com",
        to: "leonaygt2019@gmail.com",
        subject: "Instrução para recuperar a senha",
        text: "Prezado(a) Cesar. \n\nVocê solicitou alteração de senha.\n\n",
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
                    <img src="./rsz_logo.jpg" alt="" class="img-fluid mx-3"
                        style="height: 100px; width:400px; border:1px solid #d6dbe0; border-radius: 10px;">
            </div>
                <div class="row">
                    <div class="col-md-12">
                        <h1>Olá {{pessoa}}</h1>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-5">
                        <p style="background-color: black; color: white;">Este email é referente ao evento do protocolo <span
                            style="color:rgb(20, 212, 20);"> {{protocolo}}</span></p>
                    </div>
                </div>
                <p>Agradecemos a preferência.</p>
                <p>Para realizar a pesquisa de satisfação clique <a href="#">aqui</a></p>
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

module.exports = router