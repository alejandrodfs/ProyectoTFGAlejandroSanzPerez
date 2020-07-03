import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
//Components

import {CreateFormComponent} from './components/create-form/create-form.component'
import {CreateQuestionComponent} from './components/create-question/create-question.component'
import {ShowFormsComponent} from './components/show-forms/show-forms.component'
import {ShowQuestionsComponent} from './components/show-questions/show-questions.component'
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { EditFormComponent } from './components/edit-form/edit-form.component';
import { CreateAnswerComponent } from './components/create-answer/create-answer.component';
import { ShowQuestionComponent } from './components/show-question/show-question.component';
import { EditQuestionAnswersComponent } from './components/edit-question-answers/edit-question-answers.component';
import { ShowQuestionUserComponent } from './components/show-question-user/show-question-user.component';
import { EndFormComponent } from './components/end-form/end-form.component';
import { ContactFormComponent } from './components/contact-form/contact-form.component';

const routes: Routes = [
  {
    path : '',
    redirectTo: '/show-forms/1', 
    pathMatch: 'full'
  },
  {
    path : 'create-form',
    component: CreateFormComponent
  },
  {
    path : 'create-question/:Idform',
    component: CreateQuestionComponent
  },
  {
    path : 'show-forms/:page',
    component: ShowFormsComponent
  },
  {
    path: 'show-questions/:Idform',
    component: ShowQuestionsComponent

  },
  {
    path: 'login',
    component: LoginComponent

  },
  {
    path: 'register',
    component: RegisterComponent

  },
  {
    path: 'edit-form/:id',
    component: EditFormComponent
  },
  {
    path:'create-question/:Idform',
    component: CreateQuestionComponent
  },
  {
    path:'create-answer/:Idquestion',
    component: CreateAnswerComponent
  },
  {
    path: 'show-question/:id',
    component: ShowQuestionComponent
  },
  {
    path: 'edit-question-answers/:id',
    component: EditQuestionAnswersComponent
  },
  {
    path: 'show-question-user/:id',
    component: ShowQuestionUserComponent
  },
  {
    path: 'end-form/:id',
    component: EndFormComponent
  },
  {
    path: 'contact-form',
    component: ContactFormComponent
  }
  
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
