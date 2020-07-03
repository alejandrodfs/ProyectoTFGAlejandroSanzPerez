import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs/Observable';
import {GLOBAL} from './global';
import { Form } from '../models/form';
import { Question } from '../models/question';


@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  public url;
  
  constructor(private _http: Http){
    this.url = GLOBAL.url ;
}
  addQuestion(token, question: Question){
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': token
    });

    return this._http.post(this.url+'question', question, {headers: headers});
  }

  getQuestions(Idform){
    let headers = new Headers({
      'Content-Type': 'application/json',
    });
    
    let options = new RequestOptions ({headers: headers});
    return this._http.get(this.url+'questions/'+Idform, options);
  }
  getAllQuestions(Idform){
    let headers = new Headers({
      'Content-Type': 'application/json',
    });
    
    let options = new RequestOptions ({headers: headers});
    return this._http.get(this.url+'allquestions/'+Idform, options);
  }

  getQuestion(id: string){
    let headers = new Headers({
      'Content-Type': 'application/json',
    });
    let options = new RequestOptions ({headers: headers});
    return this._http.get(this.url+'question/'+id, options);
  }
  editQuestion(token,id: string, question: Question){
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': token
    });
    return this._http.put(this.url+'question/'+id, question, {headers: headers});

  }
  deleteQuestion(token,id: string){
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': token
    });
   
    let options = new RequestOptions({headers: headers});
    return this._http.delete(this.url+'question/'+id, options);
  }
  getNextQuestion(idQuestion, idAnswer){
    let headers = new Headers({
      'Content-Type': 'application/json',
    });
    let options = new RequestOptions({headers: headers});

    return this._http.get(this.url+'nextQuestion/'+idQuestion+' '+idAnswer, options);
  }
 
  
}