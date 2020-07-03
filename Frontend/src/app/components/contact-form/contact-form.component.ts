import { Component, OnInit } from '@angular/core';
import {MessageService} from '../../services/message.service';
import swal  from 'sweetalert';
import {Router, ActivatedRoute, Params} from '@angular/router';



@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css']
})
export class ContactFormComponent implements OnInit {
  
  constructor(
    public _MessageService: MessageService,
    private _route : ActivatedRoute,
    private _router : Router
    ) { }

  ngOnInit() {
  }
  contactForm(form) {
    
    this._MessageService.sendMessage(form).subscribe(() => {
      swal("Formulario de contacto", "Mensaje enviado correctamente", 'success');
    });
    this._router.navigate(['']);
    }
}
