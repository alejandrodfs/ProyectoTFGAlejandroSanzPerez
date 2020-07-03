'use strict'

//cargar las dependencias del modulo
//bcrypt se usa para la encriptacion de la contrasena
var bcrypt = require('bcrypt-nodejs');
//importamos los modelos requeridos
var User = require('../models/user');
//importamos el servicio jwt para crear el token del usuario
var jwt = require('../services/jwt');

//guardar un usuario nuevo
function saveUser( req, res){

    var user = new User();

    var params = req.body;

    user.email = params.email;

    if(params.password){
        bcrypt.hash(params.password, null, null, function(err, hash){
            user.password = hash;
            if(user.email != null){
                user.save((err, userStored)=> {
                    if(err){
                        res.status(500).send({message: 'Error al guardar el usuario'});
                    }else{
                        if(!userStored){
                            res.status(404).send({message: 'No se ha guardado el usuario'});
                        }else{
                            res.status(200).send({user: userStored});
                        }
                    }
                });
            }else{
                res.status(200).send({message: 'Introduce el email'});
            }
        });
    }else{
        res.status(200).send({message: 'Introduce la contraseña'});
    }
    
}
//logueo del usuario
function loginUser(req, res){

    var params = req.body;
    var email = params.email;
    var password = params. password;
    
   
    User.findOne({email: email}, (err, user)=>{
        if(err){
            res.status(500).send({ message: 'Error en la petición'});
        }else{
            if(!user){
                res.status(404).send({ message: 'El usuario no existe'});
            }else{
                bcrypt.compare(password, user.password, function(err, check){
                    if(check){
                        if(params.getHash){
                            //generacion del token tras loguearse correctamente
                            res.status(200).send({
                                token: jwt.createToken(user)
                            });
                        }else{
                            res.status(200).send({user});
                        }
                    }else{
                        res.status(404).send({ message: 'El usuario no ha podido loguearse'});
                    }
                });
            }
        }
    
    
    });

}
//actualizar un usuario 
function updateUser(req, res){
    var userId = req.params.id;
    var update  =req.body;

    if(userId != req.user.sub){
        return res.status(500).send({message: 'No tienes permisos para actualizar este usuario'});
    }
    User.findByIdAndUpdate(userId, update, (err, userUpdated)=>{
        if(err){
            res.status(500).send({message: 'Error al actualizar el usuario'});

        }else{
            if(!userUpdated){
                res.status(404).send({message:'No se ha podido actualizar'});
            }else{
                res.status(200).send({user: userUpdated});
            }
        }


    });
}
//borrar un usuario
function DeleteUser(req, res){
    var userID = req.params.id;

    User.findByIdAndRemove(userID, (err, userRemoved)=>{
        if(err){
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!userRemoved){
                res.status(404).send({message: 'No se ha eliminado la respuesta'});
            }else{
                res.status(200).send({answer: userRemoved});
               
            }
        }
    });
}
//obtener todos los usuarios del sistema
function getUsers(req, res){

    User.find().exec((err, users)=>{
        if(err){
            res.status(500).send({message: 'Error en la petición'});
        }else{
            if(!users){
                res.status(404).send({message: 'No hay usuarios'});
            }else{
                res.status(200).send({users});
               
            }
        }

    });
}

module.exports = {
    saveUser, 
    loginUser,
    updateUser,
    getUsers,
    DeleteUser
};