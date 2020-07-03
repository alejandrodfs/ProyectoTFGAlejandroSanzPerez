'use strict'

//cargar las dependencias del modulo
var express = require('express');
//cargar el modelo de form
var FormController = require('../Controllers/form');
//cargar express.router para poder hacer la peticiones get, post...
var api = express.Router(); 
//cargar le middleware para la autenticacion
var md_auth = require('../middlewares/authenticated');

//conjunto de peticiones que cargaran una funcion del servicio de answer
api.get('/form/:id', FormController.getForm); 
api.post('/form', md_auth.ensureAuth, FormController.saveForm); 
api.get('/forms/:page?', FormController.getForms);
api.put('/form/:id',md_auth.ensureAuth, FormController.updateForms);
api.delete('/form/:id',md_auth.ensureAuth, FormController.deleteForm);


module.exports = api;