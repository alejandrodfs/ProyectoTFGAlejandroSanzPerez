'use strict'

//cargar las dependencias del modulo
var express = require('express');
//cargar el modelo de answer
var AnswerController = require('../Controllers/answer');
//cargar express.router para poder hacer la peticiones get, post...
var api = express.Router(); 
//cargar le middleware para la autenticacion
var md_auth = require('../middlewares/authenticated');

//conjunto de peticiones que cargaran una funcion del servicio de answer
api.get('/answer/:id', AnswerController.getAnswer);  
api.post('/answer',md_auth.ensureAuth, AnswerController.saveAnswer);  
api.get('/answers/:Idquestion?', AnswerController.getAnswers);
api.put('/answer/:id', AnswerController.updateAnswer); 
api.delete('/answer/:id',md_auth.ensureAuth, AnswerController.deleteAnswer); 

module.exports = api;