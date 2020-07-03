import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { ChartsModule } from 'ng2-charts';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CreateFormComponent } from './components/create-form/create-form.component';
import { CreateQuestionComponent } from './components/create-question/create-question.component';
import { ShowFormsComponent } from './components/show-forms/show-forms.component';
import { ShowQuestionsComponent } from './components/show-questions/show-questions.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { EditFormComponent } from './components/edit-form/edit-form.component';
import { ShowQuestionComponent } from './components/show-question/show-question.component';
import { CreateAnswerComponent } from './components/create-answer/create-answer.component';
import { EditQuestionAnswersComponent } from './components/edit-question-answers/edit-question-answers.component';
import { ShowQuestionUserComponent } from './components/show-question-user/show-question-user.component';
import { EndFormComponent } from './components/end-form/end-form.component';
import { ContactFormComponent } from './components/contact-form/contact-form.component';

@NgModule({
  declarations: [
    AppComponent,
    CreateFormComponent,
    CreateQuestionComponent,
    ShowFormsComponent,
    ShowQuestionsComponent,
    LoginComponent,
    RegisterComponent,
    EditFormComponent,
    ShowQuestionComponent,
    CreateAnswerComponent,
    EditQuestionAnswersComponent,
    ShowQuestionUserComponent,
    EndFormComponent,
    ContactFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, 
    FormsModule, 
    HttpClientModule,
    HttpModule,
    ChartsModule
    
  ],
  providers: [ 
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
