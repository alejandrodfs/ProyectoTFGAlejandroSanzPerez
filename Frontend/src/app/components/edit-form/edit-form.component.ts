import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';

import {GLOBAL} from '../../services/global';
import {UserService} from '../../services/user.service';
import {FormService} from '../../services/form.service';
import {Form} from '../../models/form';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-form',
  templateUrl: './edit-form.component.html',
  styleUrls: ['./edit-form.component.css'],
  providers: [UserService,FormService]
})
export class EditFormComponent implements OnInit {

    public identity;
    public token;
    public alertMessage;
    public url : string;
    public form: Form;

  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _formService: FormService,
    private _userService:UserService
  ) { 
    this.identity = this._userService.getIdentity();
    this.token= this._userService.getToken();
    this.url = GLOBAL.url;
    this.form = new Form('','','');
  }

  ngOnInit() {
    this.getForm();
   
  }

  getForm(){
    this._route.params.forEach((params: Params)=>{
      let id = params['id'];
      
      this._formService.getForm(id).subscribe(
          response =>{

            if(!response.json().form){
             
              //this._router.navigate(['/']);
            }else{
              this.form = response.json().form;
              
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
    this._route.params.forEach((params: Params)=>{
    let id = params['id'];
    if(this.form.title!='' && this.form.level!=''){
    this._formService.editForm(this.token, id, this.form).subscribe(
      response=>{
        if(!response.json().form){
          this.alertMessage='Error en el servidor';
          this._router.navigate(['']);
        }else{
          this.alertMessage='El formulario se ha actualizado correctamente';
          this.form = response.json().form;
          setTimeout(() => { this._router.navigate(['']); }, 1000);
          
        }

      },error => {
        var errorMessage = <any>error;

        if(errorMessage != null ){
          var body = JSON.parse(error._body)
          this.alertMessage = body.message;
          
        }
      }

    );

    }else{
      this.alertMessage='Debes introducir tanto titulo como nivel';
    }
    });
  }

}
