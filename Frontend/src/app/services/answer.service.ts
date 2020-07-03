import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs/Observable';
import {GLOBAL} from './global';
import { Question } from '../models/question';
import { Answer } from '../models/answer';


@Injectable({
  providedIn: 'root'
})
export class AnswerService {
  public url;
  
  constructor(private _http: Http){
    this.url = GLOBAL.url ;
  }
  addAnswer(token, answer: Answer){
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': token
    });

    return this._http.post(this.url+'answer', answer, {headers: headers});
  }
  getAnswers(Idquestion){
    let headers = new Headers({
      'Content-Type': 'application/json',
    });
    return this._http.get(this.url+'answers/'+Idquestion, {headers: headers});
  }
  getAnswer(Idanswer){
    let headers = new Headers({
      'Content-Type': 'application/json',
    });
    return this._http.get(this.url+'answer/'+Idanswer, {headers: headers});
  }
  editAnswer(id: string, answer: Answer){
    let headers = new Headers({
      'Content-Type': 'application/json',
    });
    return this._http.put(this.url+'answer/'+id, answer, {headers: headers});

  }
  deleteAnswer(token,id: string){
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': token
    });
   
    let options = new RequestOptions({headers: headers});
    return this._http.delete(this.url+'answer/'+id, options);
  }


}
