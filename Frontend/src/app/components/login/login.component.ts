import { Component, OnInit } from '@angular/core';
import { User } from  '../../models/user';
import { UserService } from '../../services/user.service';
import { map } from 'rxjs-compat/operator/map';
import {Router, ActivatedRoute, Params} from '@angular/router';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [UserService]
})
export class LoginComponent implements OnInit {

  public user: User;
  public identity;
  public token;
  public errorMessage;
 

  constructor(
    private _userService:UserService,
    private _route : ActivatedRoute,
    private _router : Router
  ) { 
    this.user = new User('','','');
  }
    
  ngOnInit() {
    
    this.identity = this._userService.getIdentity();
    this.token= this._userService.getToken();
    
    
  }

  public onSubmit(){
    
    this._userService.singup(this.user).subscribe(
      response => {
        let identity =response.json().user;
        
        if(!identity._id){
           alert("El usuario no esta correctamente identificado");
        }else{
            //create localstorage
            localStorage.setItem('identity', identity);
            this._userService.singup(this.user,'true').subscribe(
              response => {
               
                let token =response.json().token;
                
                if(token.length <= 0){
                    alert("El token no se ha generado correctamente");
                }else{
                    //create localstorage
                    localStorage.setItem('token', token);
                    this.user = new User('','','');
                     
                    this.redireccionReload();
                    
                }
              },
              error => {
                var errorMessage = <any>error;
        
                if(errorMessage != null ){
                  var body = JSON.parse(error._body)
                  this.errorMessage = body.message;
                  
                }
              }
            );
        }
      },
      error => {
        var errorMessage = <any>error;

        if(errorMessage != null ){
          var body = JSON.parse(error._body)
          this.errorMessage = body.message;
          
        }
      }
    );
  }
 
async redireccionReload(){
    await this._router.navigate(['/show-forms/1']);
    location.reload();
}

}
