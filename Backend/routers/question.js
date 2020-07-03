'use strict'

//cargar las dependencias del modulo
var express = require('express');
//cargar el modelo de question
var QuestionController = require('../Controllers/question');
//cargar express.router para poder hacer la peticiones get, post...
var api = express.Router(); 
//cargar le middleware para la autenticacion
var md_auth = require('../middlewares/authenticated');
//cargar connect-multiparty para el tratamiento de imagenes
var multipart = require('connect-multiparty');
var md_upload = multipart({ uploadDir: './uploads' });

//conjunto de peticiones que cargaran una funcion del servicio de question
api.get('/question/:id', QuestionController.getQuestion);  
api.post('/question', md_auth.ensureAuth, QuestionController.saveQuestion);  
api.get('/questions/:Idform?', QuestionController.getQuestions);
api.put('/question/:id', md_auth.ensureAuth, QuestionController.updateQuestion);  
api.delete('/question/:id', md_auth.ensureAuth, QuestionController.deleteQuestion); 
api.get('/nextQuestion/:ids', QuestionController.getNextQuestion);
api.get('/allquestions/:Idform?',QuestionController.getAllQuestions);

api.post('/upload-image/:id',[md_auth.ensureAuth, md_upload], QuestionController.uploadImage);
//api.post('/upload-image/:id', md_upload, QuestionController.uploadImage);
api.get('/get-image/:imageFile', QuestionController.getImageFile);

module.exports = api;