const express = require('express')
require('dotenv').config()
const cors = require('cors')

const db = require('./database/mongooseConnect')
const app = express()

const bankRoutes = require('./routes/bankRoutes.js')
const usersRoutes = require('./routes/usersRoutes')

// configuracao
app.use(express.json())
app.use(cors())

// base de dados
db.connect()

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*") 
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    )
    next()
})

const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('../swagger/swagger_output.json');

app.use("/nn", bankRoutes);
app.use(usersRoutes)
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));

module.exports = app;