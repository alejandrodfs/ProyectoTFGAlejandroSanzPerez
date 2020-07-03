'use strict'

//cargar modulos requeridos
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//Creacion del schema que vamos a usar para los formularios
var formSchema = Schema({
    title : String,
    level: String
});
//exportacion del modulo 
module.exports = mongoose.model('Form', formSchema);