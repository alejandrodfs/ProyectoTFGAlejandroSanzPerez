import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { User } from  '../../models/user';
import { UserService } from '../../services/user.service';
import { get } from 'http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [UserService]
})
export class RegisterComponent implements OnInit {
  public user: User;
  public identity;
  public token;
  public Message;
  public MessageDelete;
  public users: User[];
  public opcionSeleccionada : User;


  constructor(
    private _userService:UserService,
    private _route : ActivatedRoute,
    private _router : Router,
  ) { 
    this.user = new User('','','');
  }

  ngOnInit() {
    this.identity = this._userService.getIdentity();
    this.token= this._userService.getToken();
    this.getUsers();
  }


  onSubmitRegister(){
   
    if(this.user.email!='' && this.user.password!=''){
    this._userService.register(this.user).subscribe(
      response =>{
        let user_register =response.json().user;
        this.user = user_register;
        

        if(!this.user._id){
          this.Message= 'Error en el registrarse';
        }else{
          this.Message= 'El registro se ha realizado correctamente';
          this.user = new User('','','');
          setTimeout(() => { this._router.navigate(['']); }, 1000);
        }
      },
      error => {
        var errorMessage = <any>error;

        if(errorMessage != null ){
          var body = JSON.parse(error._body)
          this.Message = body.message;
          
        }
      }

    );
    }
    this.Message= 'Debe introducir tanto el correo como la contraseña';
  }
  onSubmitDelete(){
    this._userService.DeleteUser(this.opcionSeleccionada._id).subscribe(
      response=>{
        this.MessageDelete= 'El usuario se ha borrado con exito';
        setTimeout(() => { this._router.navigate(['']); }, 1000);
      },
      error=>{
        var errorMessage = <any>error;
  
          if(errorMessage != null ){
            var body = JSON.parse(error._body)
            this.Message = body.message;
            
          }
      }
    )
  }

  getUsers(){
    this._userService.getUsers().subscribe(
      response=>{
        this.users = response.json().users;
      },
      error=>{
        
          var errorMessage = <any>error;
  
          if(errorMessage != null ){
            var body = JSON.parse(error._body)
            this.Message = body.message;
            
          }
        
      }
    );
  }
  capture(){
  }
}
