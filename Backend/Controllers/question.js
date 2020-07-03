'use strict'

//cargar las dependencias del modulo
//path y fs son usados oara acceder al sistema de ficheros, imagenes...
var path = require('path'); 
var fs = require('fs');
var mongoosePaginate = require ('mongoose-pagination'); 

//importamos los modelos requeridos
//var Form = require('../models/form');
var Question = require('../models/question');
var Answer = require('../models/answer');

//obtener un pregunta
function getQuestion( req, res){
    var QuestionID = req.params.id;
    
    Question.findById(QuestionID).populate({path: 'Idform'}).exec((err, question)=> {
        if(err){
            res.status(500).send({message:'Error en la peticion'});
        }else{
            if(!question){
                res.status(404).send({message:'El album no existe'});
            }else{
                res.status(200).send({question})
            }
        }
    });
}
//guardar una pregunta nueva
function saveQuestion(req, res){
    var question = new Question();

    var params = req.body;
    question.title = params.title;
    question.text = params.text;
    question.questionBefore = params.questionBefore;
    question.answerBefore = params.answerBefore; 
    question.Idform = params.Idform;
    question.finalQuestion = params.finalQuestion;
    question.description = params.description;
    question.urlVideo = params.urlVideo;
    
    question.save((err, questionStored) =>{
        if(err){
            res.status(500).send({message: "Error guardar la pregunta"});
        }else{
            if(!questionStored){
                res.status(404).send({message: "No se ha guardado la pregunta"});
            }else{
                res.status(200).send({question: questionStored});
            }
        }
    });
}
//obtener todas las preguntas de un formulario, en este caso se obtenien tambien con paginacion, 4 preguntas por pagina
function getQuestions(req, res){

    var parameters = req.params.Idform.split(' ');
    var formID = parameters[0];  
    if(parameters[1]){
        var page = parameters[1];
    }else{
        var page = 1;
    }
    var itemsPerPage = 4;//numero de items por pagina

    if(!formID){ //Get all questions
        var find = Question.find({});
        

    }else{ //Get questions with formID
        var find = Question.find({Idform : formID});
        
    }
    find.populate({path:'Idform'}).paginate(page, itemsPerPage, function(err, questions, totalItems){
        if(err){
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!questions){
                res.status(404).send({message: 'No hay preguntas'});
            }else{
                res.status(200).send({
                    totalItems: totalItems,
                    questions : questions
                });
            }
        }

    });
}
function getAllQuestions(req, res){
    var formID = req.params.Idform;
    
    if(!formID){ //Get all questions
        var find = Question.find({});
        

    }else{ //Get questions with formID
        var find = Question.find({Idform : formID});
        
    }
    find.populate({path:'Idform'}).exec((err, questions)=>{
        if(err){
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!questions){
                res.status(404).send({message: 'No hay respuestas'});
            }else{
                res.status(200).send({questions});
                
            }
        }
    });

}
//actualizar una pregunta
function updateQuestion(req, res){
    var questionId = req.params.id;
    var update = req.body;
    
    Question.findByIdAndUpdate(questionId, update, (err,questionUpdated )=>{
        if(err){
            res.status(500).send({message: 'Error en el servidor'});
        }else{
            if(!questionUpdated){
                res.status(404).send({message: 'No se ha actualizado la pregunta'});
            }else{
                res.status(200).send({question : questionUpdated});
            }
        }

    });
}
//borrar una pregunta
function deleteQuestion(req, res){
    var questionId = req.params.id;


    Question.findByIdAndRemove(questionId,(err, questionRemoved)=>{
        if(err){
            res.status(500).send({message: 'Error al eliminar la pregunta'});
        }else{
            if(!questionRemoved){
                res.status(404).send({message: 'La pregunta no ha sido eliminado'});
            }else{

                Answer.find({question: questionRemoved._id}).remove((err, answerRemoved)=>{
                    if(err){
                        res.status(500).send({message: 'Error al eliminar la respuesta'});
                    }else{
                        if(!answerRemoved){
                            res.status(404).send({message: 'La respuesta no ha sido eliminado'});
                        }else{
                            res.status(200).send({question: questionRemoved});
                            if(questionRemoved.image){
                                fs.unlink('./uploads/'+questionRemoved.image+'', (err) => {
                                    if (err) throw err;
                                })
                            }
                     } 
                    }
                });
              }  
            }
    });
    
    
}
//obtener siguiente pregunta
function getNextQuestion(req, res){
    var parameters = req.params.ids.split(' ');
    var idQuestion = parameters[0];
    var idAnswer = parameters[1];

    Question.findOne({questionBefore: idQuestion, answerBefore: idAnswer}, (err, nextquestion)=>{
        if(err){
            res.status(500).send({ message: 'Error en la petición'});
        }else{
            if(!nextquestion){
                res.status(404).send({ message: 'El usuario no existe'});
            }else{
                res.status(200).send({question: nextquestion});
            }
        }
    });
}

//cargar una imagen
function uploadImage(req, res){
    var questionID = req.params.id;
    
    var file_name = 'No subido...';
    if(req.files){
        var file_path = req.files.image.path;
        var file_name = file_path.split('/')[1]; 
        var file_ext = file_path.split('\.')[1];
        
        if(file_ext == 'png'  || file_ext == 'jpg' || file_ext == 'gif'){
      
            Question.findByIdAndUpdate(questionID, {image: file_name}, (err, questionUpdated)=>{
                if(!questionUpdated){
                    res.status(404).send({message: "No se ha podido actualizar"});
                }else{
                    res.status(200).send({image: file_name, question: questionUpdated});
                    
                     if(questionUpdated.image!=undefined){   
                        fs.unlink('./uploads/'+questionUpdated.image+'', (err) => {
                            if (err) throw err;
                            
                        })
                     }
                }
            });
        }else{
            res.status(200).send({message: 'Extension del archivo no valida'});
        }
    }else{
        res.status(200).send({message: 'No has subido ninguna imagen...'});
    }

}
//obtener una imagen
function getImageFile(req, res){
    var imageFile = req.params.imageFile;
    
    fs.exists('./uploads/'+imageFile, function(exists){
        if(exists){
            res.sendFile(path.resolve('./uploads/'+imageFile));
        }else{
            res.status(200).send({message: 'No existe la imagen'});
        }
    });
}
module.exports = {
   getQuestion, 
   saveQuestion, 
   getQuestions, 
   updateQuestion, 
   deleteQuestion,
   getNextQuestion,
   uploadImage,
   getImageFile,
   getAllQuestions
};