import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions} from '@angular/http';
import 'rxjs/add/operator/map';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs/Observable';
import {GLOBAL} from './global';
import { Form } from '../models/form';


@Injectable({
  providedIn: 'root'
})
export class FormService {
  public url;
  
  constructor(private _http: Http){
    this.url = GLOBAL.url ;
}
  addForm(token, form: Form){
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': token
    });

    return this._http.post(this.url+'form', form, {headers: headers});
  }
  editForm(token,id: string, form: Form){
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': token
    });

    return this._http.put(this.url+'form/'+id, form, {headers: headers});
  }
  getForms(page, level){
    let headers = new Headers({
      'Content-Type': 'application/json',
    });
    let options = new RequestOptions({headers: headers});

    return this._http.get(this.url+'forms/'+page+' '+level, options);
  }
  getForm(id:string){
    let headers = new Headers({
      'Content-Type': 'application/json',
    });
    let options = new RequestOptions({headers: headers});

    return this._http.get(this.url+'form/'+id, options);
  }
  
  deleteForm(token,id: string){
    let headers = new Headers({
      'Content-Type': 'application/json',
      'Authorization': token
    });
   
    let options = new RequestOptions({headers: headers});
    return this._http.delete(this.url+'form/'+id, options);
  }
}