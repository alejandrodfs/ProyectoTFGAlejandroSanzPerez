import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';

import {QuestionService} from '../../services/question.service';
import {AnswerService} from '../../services/answer.service';
import { Question } from 'src/app/models/question';
import { Answer } from 'src/app/models/answer';


@Component({
  selector: 'app-end-form',
  templateUrl: './end-form.component.html',
  styleUrls: ['./end-form.component.css'],
  providers: [QuestionService, AnswerService]
})
export class EndFormComponent implements OnInit {

  public identity;
  public token;
  public alertMessage;
  public idQuestion: string;
  public idAnswer: string;
  public question :Question;
  public answer : Answer;


  constructor(
    private _route : ActivatedRoute,
    private _router : Router,
    private _questionService : QuestionService,
    private _answerService : AnswerService
  ) { 
    this.question = new Question('','','','','','','','','');
    this.answer = new Answer('','','',0,false,'');
  }

  ngOnInit() {
    this.getParams();
    this.getAnswer();
 
  }
  getParams(){
    this._route.params.forEach((params: Params)=>{
      if(params['id']){
        let id = params['id'];
        var parameters = id.split(' ');
        this.idQuestion = parameters[0];
        this.idAnswer = parameters[1];
       
        this.getQuestion();
        
      }

    });
  }
  onSubmit(){
    
    this._router.navigate(['show-question-user/', this.question._id]);
   
  }
  getQuestion(){
    this._questionService.getQuestion(this.idQuestion).subscribe(
      response =>{
        
        if(!response.json().question){
         
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
  }
  getAnswer(){
    this._answerService.getAnswer(this.idAnswer).subscribe(
      response=>{
        if(!response.json().answer){
         
        }else{
          this.answer = response.json().answer;
          //this.answer.fail = this.answer.fail.replace(/\r?\n/g,' <br> ');
        }
      },
      error=>{
        var errorMessage = <any>error;

        if(errorMessage != null ){
          var body = JSON.parse(error._body)
          this.alertMessage = body.message;
          
        }
      }
    );

  }
}
