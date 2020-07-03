import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import {GLOBAL} from './global';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  public url;

  constructor(private _http: Http) { 
    this.url = GLOBAL.url ;
  }

  sendMessage(body){
    let headers = new Headers({
      'Content-Type': 'application/json',
    });
    
    return this._http.post(this.url+'faq',body, {headers: headers});
  }
}
