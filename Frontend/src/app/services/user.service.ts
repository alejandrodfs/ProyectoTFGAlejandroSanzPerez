import { Injectable } from '@angular/core';
import { Http, Response, Headers} from '@angular/http';
import 'rxjs/add/operator/map';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs/Observable';
import {GLOBAL} from './global';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  public url: string;
  public identity;
  public token;

  constructor(private _http: Http){
      this.url = GLOBAL.url ;
  }

  singup(user_to_login, gethash = null){
      if(gethash != null){
        user_to_login.getHash = gethash;
      }

      return this._http.post(this.url+'login',user_to_login);
  }

  register(user_to_register){
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    });
    return this._http.post(this.url+'register',user_to_register,{headers: headers} );

  }

  updateUser(user_to_update){
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': this.getToken()
    });
    return this._http.put(this.url+'update-user/'+user_to_update._id,user_to_update, {headers: headers});
  }

  getIdentity(){
    
    let identity = localStorage.getItem('identity');

    if(identity != "undefined"){
      this.identity = identity;
    }else{
      this.identity = null;
    }

    return this.identity;
  }

  getToken(){
    let token = localStorage.getItem('token');

    if(token != "undefined"){
      this.token = token;
    }else{
      this.token = null;
    }

    return this.token;
  }
 getUsers(){
  let headers = new Headers({
    'Content-Type': 'application/json',
    'Authorization': this.getToken()
  });
  
  return this._http.get(this.url+'users/', {headers: headers});
 }
 DeleteUser(id: string){
  let headers = new Headers({
    'Content-Type': 'application/json',
    'Authorization': this.getToken()
  });

  return this._http.delete(this.url+'user/'+id, {headers: headers});
 }
}
