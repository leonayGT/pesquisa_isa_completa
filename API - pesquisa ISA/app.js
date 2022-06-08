const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan')
const bodyParser = require('body-parser')
const rotaEmail = require('./routes/email')
const rotaInfo = require('./routes/infoSiga')

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Request-Width, Content-Type, Accept");
    app.use(cors());
    next();
});

app.use('/email', rotaInfo)
app.use('/emails', rotaEmail)

app.use((req, res, next)=>{
    const erro = new Error('Não encontrado');
    erro.status = 404
    next(erro)
});

app.use((error,req,res,next)=>{
    res.status(error.status || 500)
    return res.send({
        erro: {
            mensagem: error.message
        }
    });
});

module.exports = app;