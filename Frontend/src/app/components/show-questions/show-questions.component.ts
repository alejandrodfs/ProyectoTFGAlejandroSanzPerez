import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

import {FormService} from '../../services/form.service';
import {GLOBAL} from '../../services/global';
import {UserService} from '../../services/user.service';
import {QuestionService} from '../../services/question.service';
import {AnswerService} from '../../services/answer.service';
import {Form} from '../../models/form';
import {Question} from '../../models/question';
import {Answer} from '../../models/answer';
import { element } from 'protractor';
import { Label } from 'ng2-charts';
import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import * as pluginDataLabels from 'chartjs-plugin-datalabels';



@Component({
  selector: 'app-show-questions',
  templateUrl: './show-questions.component.html',
  styleUrls: ['./show-questions.component.css'],
  providers: [UserService, FormService, QuestionService, AnswerService]
})
export class ShowQuestionsComponent implements OnInit {

  public forms : Form[];
  public form : Form;
  public identity;
  public token;
  public alertMessage;
  public url : string;
  public questions: Question[];
  public nextpage;
  public prevpage;
  public pageControl=1;
  public confirmado;
  public numQuestions;
  public firstQuestion : Question;
  public answers : Answer[];
  public answersaux : Answer[];
  public answerSelected : Answer;
  public graficos: boolean;
  public answers1charts : Answer[];
  public answers2charts : Answer[];
  public answers3charts : Answer[];
  public answers4charts : Answer[];
  public contadorFakeQuestions=0;
  //charts
  public barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  public barChartLabels: Label[];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [pluginDataLabels];
  public barChartData: ChartDataSets[];

  constructor(
    private _route : ActivatedRoute,
    private _router : Router,
    private _formService: FormService,
    private _userService : UserService,
    private _questionService : QuestionService,
    private _answerService : AnswerService,
    private _sanitizer: DomSanitizer

    
  ) { 
    this.identity = this._userService.getIdentity();
    this.token= this._userService.getToken();
    this.url = GLOBAL.url;
    this.form = new Form('','','');
    this.graficos=false;
  }

  ngOnInit() {
    this.getForm(); 
  }
  capture(answer){
    this.answerSelected = answer;
  }
  async getForm(){
    this._route.params.forEach((params: Params)=>{
      let id = params['Idform']; 
      var page;
      
      if(!id.split(" ")[1]){
        
        page = 1;
      }else{
        page = id.split(" ")[1];
        page = parseInt(page);
        this.pageControl = page;
      }
      id = id.split(" ")[0];
      this.nextpage = page+1;
      this.nextpage = id +" "+ this.nextpage;
      this.prevpage = page - 1;
      if(this.prevpage == 0){
          this.prevpage = 1;
        }
      this.prevpage = id +" "+ this.prevpage;
      this._formService.getForm(id).subscribe(
          response =>{

            if(!response.json().form){
             
            }else{
              this.form = response.json().form;
              var params = this.form._id+ " "+ page;
              
              this._questionService.getQuestions(params).subscribe(
                response=>{
                  
                  if(!response.json().questions){
                    this.alertMessage = 'Este formulario no tiene cuestiones';
                  }else{
                    this.questions = response.json().questions;
                   
                    
                    
                    
                  }
                  
                  this.numQuestions=this.questions.length;
                  
                  this.firstQuestion = this.questions.find(element => element.answerBefore == '' && element.questionBefore== '');
                 
                  if(this.pageControl==1){
                    this.getAnswers(this.firstQuestion._id);
                    
                  }
                  this.createCharts();
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
  
  OnDeleteConfirm(id){
    this.confirmado = id;
  }
  onCancelForm(){
    this.confirmado = null;
  }
  onDeleteForm(id){
    this._formService.deleteForm(this.token, id).subscribe(
      response=>{
        if(!response.json().form){
          alert('Error en el servidor');
        }else{
          //Hay que coger todos los formularios que hay 
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
    //tenemos todas las preguntas 
    //Ahora para cada una de las preguntas debemos coger todas sus respuestas con un bucle for y borrarlas. Asi con todas las preguntas

    for(var i = 0; i < this.questions.length; i++){
      this.getAnswers(this.questions[i]._id); //get all answers for each question
      this.onDeleteQuestion(this.questions[i]._id);
    }
    this._router.navigate(['/show-forms/1']);

  }
  
  getAnswers(id) {
    this._answerService.getAnswers(id).subscribe(
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
  onSubmit(){
    var ids = this.firstQuestion._id +" "+ this.answerSelected._id;
    this.answerSelected.numselect=this.answerSelected.numselect + 1;
    this.editAnswer(this.answerSelected);
    if(this.answerSelected.finalQuestion==true){
       ids='';
       
       this._router.navigate(['end-form',ids]);
    }else{
      
      this._router.navigate(['show-question-user/', ids]);
    }
    
  }
  editAnswer(answer: Answer){
    
    this._answerService.editAnswer(answer._id,answer).subscribe(
      response=>{
        if(!response.json().answer){
          this.alertMessage='Error en el servidor';
        }else{
          this.alertMessage='El formulario se ha actualizado correctamente';
         
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

 onDeleteQuestion(id){
  this._questionService.deleteQuestion(this.token, id).subscribe(
    response=>{
      if(!response.json().question){
        alert('Error en el servidor');
      }else{
        //Hay que coger todos los formularios que hay 
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
  this.onDeleteAnswers();
  
}

onDeleteAnswers(){

  for (var i= 0; i < this.answers.length; i++){
    
    this._answerService.deleteAnswer(this.token, this.answers[i]._id).subscribe(
      response=>{
        if(!response.json().answer){
          alert('Error en el servidor');
        }else{
          //Hay que coger todos los formularios que hay 
          
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
getVideoIframe(url) {
  var video, results;
  
  if (url === null) {
      return '';
  }
  results = url.match('[\\?&]v=([^&#]*)');
  video   = (results === null) ? url : results[1];

  return this._sanitizer.bypassSecurityTrustResourceUrl('https://www.youtube.com/embed/' + video);   
}
ChangeToStats(){
  this.graficos = true;
  //Comprobacion de las preguntas
  if(this.questions.length==0){
    this.alertMessage= "Debe haber preguntas para poder ver sus estadisticas";
    this.graficos=false;
  }
  if(this.questions.length>=1){
    if(this.answers1charts.length==0){
      this.alertMessage = "Alguna de las preguntas no tiene respuestas, todas deben tener respuestas para poder ver las estadisticas";
      this.graficos=false;
    }
  }
  if(this.questions.length>=2){
    if(this.answers2charts.length==0){
      this.alertMessage = "Alguna de las preguntas no tiene respuestas, todas deben tener respuestas para poder ver las estadisticas";
      this.graficos=false;
    }
  }
  if(this.questions.length>=3){
    if(this.answers3charts.length==0){
      this.alertMessage = "Alguna de las preguntas no tiene respuestas, todas deben tener respuestas para poder ver las estadisticas";
      this.graficos=false;
    }
  }
  if(this.questions.length>=4){
    if(this.answers4charts.length==0){
      this.alertMessage = "Alguna de las preguntas no tiene respuestas, todas deben tener respuestas para poder ver las estadisticas";
      this.graficos=false;
    }
  }
  if(this.graficos==true){
    this.createCharts();
  }
  
}

ChangeToQuestions(){
  this.graficos = false;
}

getAnswersCharts1(id) {
 
  this._answerService.getAnswers(id).subscribe(
    response=>{
       this.answers1charts= response.json().answers;
      
    },
    error => {
      var errorMessage = <any>error;

      if(errorMessage != null ){
        var body = JSON.parse(error._body)
        this.alertMessage = body.message;
        
      }
    });
    
}
getAnswersCharts2(id) {
  this._answerService.getAnswers(id).subscribe(
    response=>{
       this.answers2charts= response.json().answers;
       
    },
    error => {
      var errorMessage = <any>error;

      if(errorMessage != null ){
        var body = JSON.parse(error._body)
        this.alertMessage = body.message;
        
      }
    });
    
}
getAnswersCharts3(id) {
  this._answerService.getAnswers(id).subscribe(
    response=>{
       this.answers3charts= response.json().answers;
       
    },
    error => {
      var errorMessage = <any>error;

      if(errorMessage != null ){
        var body = JSON.parse(error._body)
        this.alertMessage = body.message;
        
      }
    });
    
}
getAnswersCharts4(id) {
  this._answerService.getAnswers(id).subscribe(
    response=>{
       this.answers4charts= response.json().answers;
       
    },
    error => {
      var errorMessage = <any>error;

      if(errorMessage != null ){
        var body = JSON.parse(error._body)
        this.alertMessage = body.message;
        
      }
    });
    
}
createQuestionFake(){
  var questionaux= new Question("","No hay pregunta","","","","","","","") ;
  this.questions.push(questionaux);
  this.contadorFakeQuestions++;
}
async createCharts(){

  


  if(this.questions.length>=1){
    await this.getAnswersCharts1(this.questions[0]._id);
  }
  if(this.questions.length>=2){
    await this.getAnswersCharts2(this.questions[1]._id);
  }
  if(this.questions.length>=3){
   await this.getAnswersCharts3(this.questions[2]._id);
  }
  if(this.questions.length==4){
   await this.getAnswersCharts4(this.questions[3]._id);
  }
  var answer = new Answer ("", "", "", 0, false, "");
  
  if(this.questions.length<1){
    this.createQuestionFake();
    this.createQuestionFake();
    this.createQuestionFake();
    this.createQuestionFake();
    
    this.answers1charts = [answer, answer, answer, answer];
    this.answers2charts = [answer, answer, answer, answer];
    this.answers3charts = [answer, answer, answer, answer];
    this.answers4charts = [answer, answer, answer, answer];
  
    
  }
  else if(this.questions.length<2){
    this.createQuestionFake();
    this.createQuestionFake();
    this.createQuestionFake();
    
    this.answers2charts = [answer, answer, answer, answer];
    this.answers3charts = [answer, answer, answer, answer];
    this.answers4charts = [answer, answer, answer, answer];
  }
  else if(this.questions.length<3){
    this.createQuestionFake();
    this.createQuestionFake();
    
    this.answers3charts = [answer, answer, answer, answer];
    this.answers4charts = [answer, answer, answer, answer];
  
    
  }
  else if(this.questions.length<4){
    this.createQuestionFake();
    
    this.answers4charts = [answer, answer, answer, answer];
    
  }

  
  this.barChartLabels = [this.questions[0].title,this.questions[1].title,this.questions[2].title,this.questions[3].title];
  this.barChartData =[
    { data: [this.answers1charts[0].numselect,this.answers2charts[0].numselect,this.answers3charts[0].numselect,this.answers4charts[0].numselect], label:'Respuesta 1'},
    { data: [this.answers1charts[1].numselect,this.answers2charts[1].numselect,this.answers3charts[1].numselect,this.answers4charts[1].numselect], label:'Respuesta 2'},
    { data: [this.answers1charts[2].numselect,this.answers2charts[2].numselect,this.answers3charts[2].numselect,this.answers4charts[2].numselect], label:'Respuesta 3'},
    { data: [this.answers1charts[3].numselect,this.answers2charts[3].numselect,this.answers3charts[3].numselect,this.answers4charts[3].numselect], label:'Respuesta 4'},
    
  ]
  for (var i= 0; i<this.contadorFakeQuestions;i++){
    this.questions.pop();
  }
  this.contadorFakeQuestions=0;
  this.answers1charts= [];
  this.answers2charts= [];
  this.answers3charts= [];
  this.answers4charts= [];
  
 
}
}
