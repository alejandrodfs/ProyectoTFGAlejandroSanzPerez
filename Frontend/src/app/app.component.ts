import { Component, OnInit } from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import { User } from './models/user';
import {UserService} from './services/user.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
 
})

export class AppComponent implements OnInit {
  public title = 'TFG';
  public user: User;
  public identity;
  public token;

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
    
    
  }
  logout(){
    localStorage.removeItem('identity');
    localStorage.removeItem('token');
    localStorage.clear();
    this.identity= null;
    this.token = null;
    this.redireccionReload();
  }
  async redireccionReload(){
    await this._router.navigate(['/show-forms/1']);
    location.reload();
  }
}
