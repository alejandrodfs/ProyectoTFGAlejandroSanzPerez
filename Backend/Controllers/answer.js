'use strict'
//cargar las dependencias del modulo
/*var path = require('path'); 
var fs = require('fs');*/
var mongoosePaginate = require ('mongoose-pagination'); 

//cargar los modelos necesarios
/*var Form = require('../models/form');
var Question = require('../models/question');*/
var Answer = require('../models/answer');

//funcion para obtener un respuesta mediante el id
function getAnswer(req, res){
    var answerId = req.params.id;

    Answer.findById(answerId).populate({path: 'Idquestion'}).exec((err, answer)=>{
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        }else{
            if(!answer){
                res.status(404).send({message: 'La respuesta no existe'});
            }else{
                res.status(200).send({answer});
            }
        }

    });
    
}
//funcion para guardar un pregunta en la base de datos
function saveAnswer(req, res){
    var answer = new Answer();

    var params = req.body;
    answer.text = params.text;
    answer.numselect = params.numselect;
    answer.Idquestion = params.Idquestion;
    answer.finalQuestion = params.finalQuestion;
    answer.fail = params.fail;

    answer.save((err, answerStored) =>{
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        }else{
            if(!answerStored){
                res.status(404).send({message: 'No ha sido guardada la respuesta'});
            }else{
                res.status(200).send({answer: answerStored});
            }
        }
    });
}
//funcion para obtener todas la respuestas pertenecientes a una pregunta
function getAnswers(req, res){
    var questionId = req.params.Idquestion;
  
    if(!questionId){ //Get all questions
        var find = Answer.find({});
        

    }else{ //Get questions with formID
        var find = Answer.find({Idquestion : questionId});
        
    }
    find.populate({
        path:'Idquestion',
        populate: {
            path: 'Idform',
            model: 'Form'
        }
    }).exec((err, answers)=>{
        if(err){
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!answers){
                res.status(404).send({message: 'No hay respuestas'});
            }else{
                res.status(200).send({answers});
            }
        }

    });
}
//Funcion para actualizar una respuesta
function updateAnswer(req, res){
   
    var answerId = req.params.id;
    var update = req.body;
    
    Answer.findByIdAndUpdate(answerId, update, (err, answerupdated)=>{
        if(err){
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!answerupdated){
                res.status(404).send({message: 'No hay respuestas'});
            }else{
                res.status(200).send({answer: answerupdated});
            }
        }
    });
}
//Funcion para borrar una repuesta con su id
function deleteAnswer(req, res){
    var answerId = req.params.id;

    Answer.findByIdAndRemove(answerId, (err, answerRemoved)=>{
        if(err){
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!answerRemoved){
                res.status(404).send({message: 'No se ha eliminado la respuesta'});
            }else{
                res.status(200).send({answer: answerRemoved});
            }
        }
    });
}

module.exports = {
    getAnswer, 
    saveAnswer, 
    getAnswers,
    updateAnswer,
    deleteAnswer
 };