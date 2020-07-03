import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';

import {FormService} from '../../services/form.service';
import {GLOBAL} from '../../services/global';
import {UserService} from '../../services/user.service';
import {Form} from '../../models/form';

@Component({
  selector: 'app-show-forms',
  templateUrl: './show-forms.component.html',
  styleUrls: ['./show-forms.component.css'],
  providers: [UserService, FormService]
})
export class ShowFormsComponent implements OnInit {
  public forms : Form[];
  public identity;
  public token;
  public alertMessage;
  public url : string;
  public nextpage;
  public prevpage;
  public formsEasy : Form[];
  public formsMedium : Form[];
  public formsHard : Form[];
 

  constructor(
    private _route : ActivatedRoute,
    private _router : Router,
    private _formService: FormService,
    private _userService : UserService
  ) { 
    this.identity = this._userService.getIdentity();
    this.token= this._userService.getToken();
    this.url = GLOBAL.url;

  }

  ngOnInit() {
    
    this.getForms();
   
  
    
    
    
  }
 
  getForms(){
   
    this._route.params.forEach((params: Params)=>{
      let page =+ params['page'];
      if(!page){
        page=1;
      }else{
        this.nextpage = page+1;
        this.prevpage = page -1;
        if(this.prevpage == 0){
          this.prevpage = 1;
        }
      }
      var level = 'Medio';
      this._formService.getForms(page,level).subscribe(
        response=>{
    
          if(!response.json().forms){
            this.alertMessage='Error en el servidor';

          }else{
            this.alertMessage='El formulario se ha actualizado correctamente';
            this.formsMedium = response.json().forms;
           
            
          }
  
        },error => {
          var errorMessage = <any>error;
  
          if(errorMessage != null ){
            var body = JSON.parse(error._body)
            this.alertMessage = body.message;
            
            
          }
        }
  
      )
      var level = 'Fácil';
      this._formService.getForms(page,level).subscribe(
        response=>{
    
          if(!response.json().forms){
            this.alertMessage='Error en el servidor';
    
          }else{
            this.alertMessage='El formulario se ha actualizado correctamente';
            this.formsEasy = response.json().forms;
            
          
            
          }
  
        },error => {
          var errorMessage = <any>error;
  
          if(errorMessage != null ){
            var body = JSON.parse(error._body)
            this.alertMessage = body.message;
            
            
          }
        }
  
      )
      var level = 'Difícil';
      this._formService.getForms(page,level).subscribe(
        response=>{
    
          if(!response.json().forms){
            this.alertMessage='Error en el servidor';
    
          }else{
            this.alertMessage='El formulario se ha actualizado correctamente';
            this.formsHard = response.json().forms;
            
          }
  
        },error => {
          var errorMessage = <any>error;
  
          if(errorMessage != null ){
            var body = JSON.parse(error._body)
            this.alertMessage = body.message;
            
            
          }
        }
  
      )

    });
  }
}
