import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';

import {FormService} from '../../services/form.service';
import {GLOBAL} from '../../services/global';
import {UserService} from '../../services/user.service';
import {QuestionService} from '../../services/question.service';
import {AnswerService} from '../../services/answer.service';
import {Form} from '../../models/form';
import {Question} from '../../models/question';
import {Answer} from '../../models/answer';
import { resolve } from 'url';

@Component({
  selector: 'app-create-question',
  templateUrl: './create-question.component.html',
  styleUrls: ['./create-question.component.css'],
  providers: [UserService, FormService, QuestionService]
})
export class CreateQuestionComponent implements OnInit {
  public form : Form;
  public identity;
  public token;
  public alertMessage;
  public url : string;
  public question: Question;
  public questions: Question[];
  public opcionSeleccionado: Question;
  public opcionSeleccionadoAnswer: Question;
  public answers : Answer[];
  public morequestions;
  public optionSelectedBefore : boolean;
  public filesToUpload: Array<File>;
  

  constructor(
    private _route : ActivatedRoute,
    private _router : Router,
    private _formService: FormService,
    private _userService : UserService,
    private _questionService : QuestionService,
    private _answerService : AnswerService,
    
  ) { 
    this.identity = this._userService.getIdentity();
    this.token= this._userService.getToken();
    this.url = GLOBAL.url;
    this.question = new Question('','','','','','','','','');
    this.form = new Form('','','');
    this.optionSelectedBefore = false;
  }

  ngOnInit() {
    this.getForm();
    
    
  }
  getForm(){
    this._route.params.forEach((params: Params)=>{
      let id = params['Idform'];
      
      this._formService.getForm(id).subscribe(
          response =>{

            if(!response.json().form){
             
             
            }else{
              this.form = response.json().form;
              this._questionService.getAllQuestions(this.form._id).subscribe(
                response=>{
                  
                  if(!response.json().questions){
                    this.alertMessage = 'Este formulario no tiene cuestiones';
                  }else{
                    this.questions = response.json().questions;

                    
                if(this.questions.length==0){
                  this.morequestions='vacio';
                }
                  }
                }, 
                error => {
                  var errorMessage = <any>error;
          
                  if(errorMessage != null ){
                    var body = JSON.parse(error._body)
                    this.alertMessage = body.message;
                    
                  }
                }
              );
            }

          },
          error => {
            var errorMessage = <any>error;
    
            if(errorMessage != null ){
              var body = JSON.parse(error._body)
              this.alertMessage = body.message;
              
            }
          }
      );
    });
  }
  onSubmit(){
    this.question.Idform= this.form._id;
    if(this.question.title && this.question.description && this.question.text){
      if((this.morequestions!='vacio' && this.opcionSeleccionado!=undefined && this.opcionSeleccionadoAnswer!=undefined) || this.morequestions=='vacio'){
        if(this.optionSelectedBefore != true){
          
          if(this.opcionSeleccionado!= undefined){
            this.question.questionBefore = this.opcionSeleccionado._id;
          }
          if(this.opcionSeleccionadoAnswer!= undefined){
          this.question.answerBefore = this.opcionSeleccionadoAnswer._id;
          }
          this._questionService.addQuestion(this.token, this.question).subscribe(
            response=>{
              
              if(!response.json().question){
                this.alertMessage='Error en el servidor';
              }else{
                this.question =response.json().question;
                
                if(!this.filesToUpload){
                  //redireccion
                }else{
                  //var aux = this.question._id+" true"; Aqui no habria que borrar pero en edit si 
                  var aux = this.question._id;
                  
                  this.makeFileRequest(this.url+'upload-image/'+aux, [], this.filesToUpload).then(
                    (result : any)=>{
                      
                      this.question.image = result.image;
                     
                     
                    }
                  );
                  
                }

                this.alertMessage='La pregunta se ha guardado correctamente';
              
                this._router.navigate(['/show-questions',this.form._id]);
              }
            },
            error => {
              var errorMessage = <any>error;

              if(errorMessage != null ){
                var body = JSON.parse(error._body)
                this.alertMessage = body.message;
                
              }
            }
          );
          }
          else{
            this.alertMessage = 'Las opciones de pregunta anterior y respuesta anterior ya han sido escogidas';
          }
        }else{
          this.alertMessage = 'Debes rellenar la pregunta anterior y su respuesta con las que la vas a relacionar';
        }
  }else{
    this.alertMessage = 'Debes rellenar tanto el titulo como la pregunta y la descripcion';
  }

  }
  capturarQuestion() {
    // Pasamos el valor seleccionado a la variable verSeleccion
    this._answerService.getAnswers(this.opcionSeleccionado._id).subscribe(
      response=>{
        this.answers = response.json().answers;
       
      },
      error => {
        var errorMessage = <any>error;

        if(errorMessage != null ){
          var body = JSON.parse(error._body)
          this.alertMessage = body.message;
          
        }
      });
}
capturarAnswer(){
  this._questionService.getNextQuestion(this.opcionSeleccionado._id, this.opcionSeleccionadoAnswer._id).subscribe(
    response=>{
      this.optionSelectedBefore = true;
      if(!response.json().question){
        alert('Error en el servidor');
      }else{
        
      }
    },
    error=>{
      var errorMessage = <any>error;
      this.optionSelectedBefore = false;
      if(errorMessage != null ){
        var body = JSON.parse(error._body)
        this.alertMessage = body.message;
        
      }
      this.alertMessage = "";
    })
}


fileChangeEvent(fileInput : any){
 this.filesToUpload = <Array<File>>fileInput.target.files;
 
 
}
makeFileRequest(url : string, params : Array<string>, files: Array<File>){
  var token = this.token;

  return new Promise (function(resolve, reject){ //lanza el codigo de la subida
    var formData : any = new FormData();
    var xhr = new XMLHttpRequest();

    for(var i = 0; i < files.length; i++){
      formData.append('image', files[i], files[i].name);
    }
    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4){
          if(xhr.status == 200){
            resolve(JSON.parse(xhr.response));
          }else{
            reject(xhr.response);
          }
         
        }   
    }
    xhr.open('POST',url, true);
    xhr.setRequestHeader('Authorization', token);
    xhr.send(formData);
  })
}
}
