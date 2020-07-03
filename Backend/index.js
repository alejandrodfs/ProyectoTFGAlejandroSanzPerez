'use strict'

//cargar las dependencias del modulo
var mongoose = require('mongoose');
var app = require('./app');
//Determinar el puerto
var port = process.env.PORT || 3977;

//Conexion con la base de datos de mongodb
mongoose.Promise = global.Promise;    
mongoose.connect('mongodb://localhost:27017/CasosUva',{ useNewUrlParser: true , useUnifiedTopology: true, useFindAndModify: false },(err, res) => {
   
    if(err){
        throw err;
    }else{
        console.log("La conexion a la base de datos esta funcionando correctamente");
        app.listen(port, function(){
           console.log("Server del api rest escuchando");
        });
    }
})







// mongoose.connect('mongodb+srv://alejandro:proyecto1@cluster0-svosf.mongodb.net/test?retryWrites=true&w=majority',{ useNewUrlParser: true , useUnifiedTopology: true},(err, res) => {   
