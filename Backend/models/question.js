'use strict'

//cargar modulos requeridos
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//Creacion del schema que vamos a usar para las preguntas
var questionSchema = Schema({
    title : String,
    description: String,
    text: String,
    questionBefore: String,
    answerBefore: String, 
    image : String,
    urlVideo : String,
    Idform: {type : Schema.ObjectId, ref: 'Form'}
});
//exportacion del modulo 
module.exports = mongoose.model('Question', questionSchema);



