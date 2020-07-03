'use strict'

//cargar las dependencias del modulo
var express = require('express');
var bodyParser = require('body-parser');

var app = express();

//cargar rutas
var user_routes = require ('./routers/user');
var form_routes = require('./routers/form');
var question_routes = require('./routers/question');
var answer_routes = require('./routers/answer');
var faq_routes = require('./routers/faq');

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//configurar cabeceras http
app.use((req, res, next)=>{
    res.header('Access-Control-Allow-Origin','*');
    res.header('Access-Control-Allow-Headers','Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow','GET, POST, OPTIONS, PUT, DELETE');
    next();
});

//rutas base
app.use('/api', user_routes);
app.use('/api', form_routes);
app.use('/api', question_routes);
app.use('/api', answer_routes);
app.use('/api', faq_routes);

module.exports = app;

