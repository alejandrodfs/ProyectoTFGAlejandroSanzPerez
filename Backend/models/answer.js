'use strict'

//cargar modulos requeridos
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//Creacion del schema que vamos a usar para los respuestas
var answerSchema = Schema({ 
    text: String, 
    fail: String,
    numselect: Number,
    finalQuestion: Boolean,
    Idquestion: {type : Schema.ObjectId, ref: 'Question'}
});
//exportacion del modulo 
module.exports = mongoose.model('Answer', answerSchema);