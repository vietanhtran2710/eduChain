import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { JwtInterceptor } from './_helpers/jwt.interceptor';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { MainNavComponent } from './main-nav/main-nav.component';
import { CourseComponent } from './course/course.component';
import { QuizComponent } from './quiz/quiz.component';
import { ProfileComponent } from './profile/profile.component';
import { PaymentComponent } from './payment/payment.component';
import { ViewComponent } from './view/view.component';
import { ContestsListComponent } from './contests-list/contests-list.component';
import { ContestComponent } from './contest/contest.component';
import { ExamComponent } from './exam/exam.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    HomeComponent,
    AdminComponent,
    MainNavComponent,
    CourseComponent,
    QuizComponent,
    ProfileComponent,
    PaymentComponent,
    ViewComponent,
    ContestsListComponent,
    ContestComponent,
    ExamComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SweetAlert2Module.forRoot(),
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
