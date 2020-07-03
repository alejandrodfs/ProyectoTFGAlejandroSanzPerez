'use strict'

//cargar modulos requeridos
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//Creacion del schema que vamos a usar para los usuarios
var userSchema = Schema({
    email: String,
    password: String
});
//exportacion del modulo 
module.exports = mongoose.model('User', userSchema);