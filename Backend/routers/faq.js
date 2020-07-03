'use strict'

//cargar las dependencias del modulo
var express = require('express');
//cargar express.router para poder hacer la peticiones get, post...
var api = express.Router();
//carga el fichero ConfigureMessage necesario para el funcionamiento
const configureMessage = require('../ConfigureMessage');

api.post('/faq',(req, res) => {
 configureMessage(req.body);
 res.status(200).send();
})




module.exports = api;