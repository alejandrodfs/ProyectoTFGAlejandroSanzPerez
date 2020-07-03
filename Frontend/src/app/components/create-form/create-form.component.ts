import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';

import {GLOBAL} from '../../services/global';
import {UserService} from '../../services/user.service';
import {FormService} from '../../services/form.service';
import {Form} from '../../models/form';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-create-form',
  templateUrl: './create-form.component.html',
  styleUrls: ['./create-form.component.css'],
  providers: [UserService,FormService]
})
export class CreateFormComponent implements OnInit {
  public identity;
  public token;
  public alertMessage;
  public url : string;
  public form: Form;

  constructor( 
    private _formService: FormService,
    private _userService:UserService,
    private _route : ActivatedRoute,
    private _router : Router,
    ) { 
      this.identity = this._userService.getIdentity();
      this.token= this._userService.getToken();
      this.url = GLOBAL.url;
      this.form = new Form('','','');
    }

  ngOnInit() {
    
  }

  onSubmit(){
    if(this.form.title!='' && this.form.level!=''){
    this._formService.addForm(this.token, this.form).subscribe(
      response=>{
        
        if(!response.json().form){
          this.alertMessage='Error en el servidor';
        }else{
          this.form =response.json().form;
          this.alertMessage='El formulario se ha guardado correctamente';
          setTimeout(() => { this._router.navigate(['']); }, 1000);
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
    this.alertMessage='Debes introducir tanto titulo como nivel';
  }
  
}
