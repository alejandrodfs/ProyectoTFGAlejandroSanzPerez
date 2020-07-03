import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';

import {FormService} from '../../services/form.service';
import {GLOBAL} from '../../services/global';
import {UserService} from '../../services/user.service';
import {QuestionService} from '../../services/question.service';
import {AnswerService} from '../../services/answer.service';
import {Answer} from '../../models/answer';
import {Question} from '../../models/question';

@Component({
  selector: 'app-create-answer',
  templateUrl: './create-answer.component.html',
  styleUrls: ['./create-answer.component.css'],
  providers: [UserService, QuestionService, AnswerService]
})
export class CreateAnswerComponent implements OnInit {
  public identity;
  public token;
  public alertMessage;
  public url : string;
  public question: Question;
  public answer1 : Answer;
  public answer2 : Answer;
  public answer3 : Answer;
  public answer4 : Answer;
  

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
    this.answer1 = new Answer('','','',0,false,'');
    this.answer2 = new Answer('','','',0,false,'');
    this.answer3 = new Answer('','','',0,false,'');
    this.answer4 = new Answer('','','',0,false,'');
   
   }

  ngOnInit() {
    this.getQuestion()
    
  }

  getQuestion(){
    this._route.params.forEach((params: Params)=>{
      let id = params['Idquestion'];
      this._questionService.getQuestion(id).subscribe(
        response =>{
          
          if(!response.json().question){
           
            //this._router.navigate(['/']);
          }else{
            this.question = response.json().question;
            
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
  this.answer1.Idquestion=this.question._id;
  this.answer2.Idquestion=this.question._id;
  this.answer3.Idquestion=this.question._id;
  this.answer4.Idquestion=this.question._id;

  if(this.answer1.text!='' && this.answer2.text!=''&& this.answer3.text!=''&& this.answer4.text!='' ){
    
      if((this.answer1.fail!='' && this.answer1.finalQuestion==true )|| (this.answer2.fail!='' && this.answer2.finalQuestion==true) || (this.answer3.fail!='' && this.answer3.finalQuestion==true) || (this.answer4.fail!='' && this.answer4.finalQuestion==true ) ){
        this.alertMessage = "No puede ser una pregunta final y tener feedback";
      }else{
        this.SaveAnswer(this.answer1);
        this.SaveAnswer(this.answer2);
        this.SaveAnswer(this.answer3);
        this.SaveAnswer(this.answer4);
      }
    }else{
      this.alertMessage ="Todas la preguntas deben estar rellenas";
    }
  
}
SaveAnswer(answer : Answer){
  this._answerService.addAnswer(this.token,answer).subscribe(
    response=>{
      if(!response.json().answer){
           this.alertMessage = "No se ha podido añadir la respuesta";
        //this._router.navigate(['/']);
      }else{
        this.alertMessage = "La respuesta se ha guardado correctamente";
        this._router.navigate(['/show-question',this.question._id]);
        
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
}
