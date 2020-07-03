import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';

import {FormService} from '../../services/form.service';
import {GLOBAL} from '../../services/global';
import {UserService} from '../../services/user.service';
import {QuestionService} from '../../services/question.service';
import {AnswerService} from '../../services/answer.service';
import {Answer} from '../../models/answer';
import {Question} from '../../models/question';
import { Form } from 'src/app/models/form';

@Component({
  selector: 'app-edit-question-answers',
  templateUrl: './edit-question-answers.component.html',
  styleUrls: ['./edit-question-answers.component.css'],
  providers: [UserService, QuestionService, AnswerService]
})
export class EditQuestionAnswersComponent implements OnInit {
  public identity;
  public token;
  public alertMessage;
  public url : string;
  public question: Question;
  public answer1 : Answer;
  public answer2 : Answer;
  public answer3 : Answer;
  public answer4 : Answer;
  public answers : Answer[];
  public add_res: String;
  public opcionSeleccionado;
  public opcionSeleccionadoAnswer;
  public questions: Question[];
  public idform : string;
  public questionSelectedBefore: Question;
  public answerSelectedBefore: Answer;
  public optionSelectedBefore: boolean;
  public checkquestion : Question;
  public filesToUpload : Array<File>;

  constructor(
    private _route : ActivatedRoute,
    private _router : Router,
    private _answerService: AnswerService,
    private _userService : UserService,
    private _questionService : QuestionService,
  ) {
    this.identity = this._userService.getIdentity();
    this.token= this._userService.getToken();
    this.url = GLOBAL.url;
    this.question = new Question('','','','','','','','','');
    this.questionSelectedBefore = new Question('','','','','','','','','');
    this.answerSelectedBefore = new Answer('','','',0,false,'');
    this.answer1 = new Answer('','','',0,false,'');
    this.answer2 = new Answer('','','',0,false,'');
    this.answer3 = new Answer('','','',0,false,'');
    this.answer4 = new Answer('','','',0,false,'');
    this.optionSelectedBefore = false;
   }

  ngOnInit() {
    this.getQuestionAndAnswers();
    
    
  }
  getQuestionAndAnswers(){
    this._route.params.forEach((params: Params)=>{
      let id = params['id'];
      this._questionService.getQuestion(id).subscribe(
        response =>{
          
          if(!response.json().question){
           
          }else{
            this.question = response.json().question;
            var cadena = JSON.stringify(this.question.Idform);
            if(this.question.answerBefore!='' && this.question.questionBefore!=''){
              this.getQuestionSelectedBefore();
              this.getAnswerSelectedBefore();
            }
            this.idform=cadena.split(",")[0].split(":")[1].replace('"','').replace('"','');
            this.getQuestions();

            this._answerService.getAnswers(id).subscribe(
              response=>{
                this.answers = response.json().answers;
                
                if(this.answers[0]!=undefined){
                  this.answer1 = this.answers[0];
                }
                if(this.answers[1]!=undefined){
                  this.answer2 = this.answers[1];
                }
                if(this.answers[2]!=undefined){ 
                  this.answer3 = this.answers[2];
                }
                if(this.answers[3]!=undefined){
                  this.answer4 = this.answers[3];
                }
                
              
              },
              error => {
                var errorMessage = <any>error;
        
                if(errorMessage != null ){
                  var body = JSON.parse(error._body)
                  this.alertMessage = body.message;
                  
                }
              });
            
          }
        },
        error => {
          var errorMessage = <any>error;
  
          if(errorMessage != null ){
            var body = JSON.parse(error._body)
            this.alertMessage = body.message;
            
          }
        });
      
      
  });
  
}
onSubmit(){
  
  if(this.optionSelectedBefore != true || ( this.question._id == this.checkquestion._id && this.optionSelectedBefore == true)){
    if(this.opcionSeleccionado==undefined && this.opcionSeleccionadoAnswer==undefined){
      this.question.answerBefore=this.answerSelectedBefore._id;
      this.question.questionBefore=this.questionSelectedBefore._id;
    }else{
    if(this.question.answerBefore!=''&& this.question.questionBefore!=''){
      this.question.answerBefore=this.opcionSeleccionadoAnswer._id;
      this.question.questionBefore=this.opcionSeleccionado._id;
    }
    }
    
    if(this.question.text!='' && this.question.title!='' && this.question.description!=''){ 
    this._questionService.editQuestion(this.token, this.question._id, this.question).subscribe(
      response=>{
        if(!response.json().question){
          this.alertMessage='Error en el servidor';
        }else{
          
          this.question = response.json().question;
         
        }

      },error => {
        var errorMessage = <any>error;

        if(errorMessage != null ){
          var body = JSON.parse(error._body)
          this.alertMessage = body.message;
          
        }
      }

    );
    }
    //llamamos a edit answer
    if(this.answer1.text!='' && this.answer2.text!=''&& this.answer3.text!=''&& this.answer4.text!='' ){
      if(this.question.text!='' && this.question.title!='' && this.question.description!=''){
        if((this.answer1.fail!='' && this.answer1.finalQuestion==true )|| (this.answer2.fail!='' && this.answer2.finalQuestion==true) || (this.answer3.fail!='' && this.answer3.finalQuestion==true) || (this.answer4.fail!='' && this.answer4.finalQuestion==true ) ){
          this.alertMessage = "No puede ser una pregunta final y tener feedback";
        }else{
          this.editAnswer(this.answer1);
          this.editAnswer(this.answer2);
          this.editAnswer(this.answer3);
          this.editAnswer(this.answer4);

          if(!this.filesToUpload){
            //redireccion
          }else{
            
            this.makeFileRequest(this.url+'upload-image/'+this.question._id, [], this.filesToUpload).then(
              (result : any)=>{
                this.question.image = result.image;
                
              }
            );
            
          }
        }
      }else{
        this.alertMessage='Debes introducir tanto titulo como la pregunta y la descripción' ;
      }
    }else{
      this.alertMessage ="Todas la preguntas deben estar rellenas";
    }
  }else{
    this.alertMessage = 'Las opciones de pregunta anterior y respuesta anterior ya han sido escogidas';
  }

  }

  editAnswer(answer: Answer){
    this._answerService.editAnswer(answer._id,answer).subscribe(
      response=>{
        
        if(!response.json().answer){
          this.alertMessage='Error en el servidor';
          
        }else{
          if(this.alertMessage==undefined){
            this.alertMessage='El formulario se ha actualizado correctamente';
          }
          this._router.navigate(['/show-question',this.question._id]);
        }
      },error => {
        var errorMessage = <any>error;
  
        if(errorMessage != null ){
          var body = JSON.parse(error._body)
          this.alertMessage = body.message;
          
        }
      }
    );
    }

    capturarQuestion() {
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
          this.checkquestion = response.json().question;
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

    getQuestions(){
     
      this._questionService.getAllQuestions(this.idform).subscribe(
        response=>{
          
          if(!response.json().questions){
            this.alertMessage = 'Este formulario no tiene cuestiones';
          }else{
            this.questions = response.json().questions;
          
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
    getQuestionSelectedBefore(){
      this._questionService.getQuestion(this.question.questionBefore).subscribe(
        response=>{
          if(!response.json().question){
            this.alertMessage = 'Este formulario no tiene cuestiones';
          }else{
            this.questionSelectedBefore = response.json().question;
            
          
          }
        },
        error=>{
          var errorMessage = <any>error;
  
          if(errorMessage != null ){
            var body = JSON.parse(error._body)
            this.alertMessage = body.message;
            
        }
      
    });
  }
  getAnswerSelectedBefore(){
    this._answerService.getAnswer(this.question.answerBefore).subscribe(
      response=>{
        if(!response.json().answer){
          this.alertMessage = 'Este formulario no tiene cuestiones';
        }else{
          this.answerSelectedBefore = response.json().answer;
         
        
        }
      },
      error=>{
        var errorMessage = <any>error;

        if(errorMessage != null ){
          var body = JSON.parse(error._body)
          this.alertMessage = body.message;
          
      }
    
  });
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


