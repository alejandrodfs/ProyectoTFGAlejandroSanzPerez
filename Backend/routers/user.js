'use strict'

//cargar las dependencias del modulo
var express = require('express');
//cargar el modelo de user
var UserController = require('../Controllers/user');
//cargar express.router para poder hacer la peticiones get, post...
var api = express.Router();
//cargar le middleware para la autenticacion
var md_auth = require('../middlewares/authenticated'); 

//conjunto de peticiones que cargaran una funcion del servicio de user
api.post('/register',md_auth.ensureAuth,UserController.saveUser);
api.post('/login',UserController.loginUser);
api.put('/update-user/:id',md_auth.ensureAuth, UserController.updateUser);
api.delete('/user/:id',md_auth.ensureAuth, UserController.DeleteUser);
api.get('/users/',md_auth.ensureAuth, UserController.getUsers);

module.exports = api;