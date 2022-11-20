import { NgModule } from '@angular/core';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { CourseComponent } from './course/course.component';
import { QuizComponent } from './quiz/quiz.component';
import { ProfileComponent } from './profile/profile.component';
import { PaymentComponent } from './payment/payment.component';
import { ViewComponent } from './view/view.component';
import { ContestsListComponent } from './contests-list/contests-list.component';
import { ContestComponent } from './contest/contest.component';
import { ExamComponent } from './exam/exam.component';

const routes: Routes = [
  {path: "", component: LandingPageComponent},
  {path: "home", component: HomeComponent},
  {path: "admin", component: AdminComponent},
  {path: "course/:id", component: CourseComponent},
  {path: "quiz/:id", component: QuizComponent},
  {path: "profile/:address", component: ProfileComponent},
  {path: "payment", component: PaymentComponent},
  {path: "view/:hash", component: ViewComponent},
  {path: "contestslist", component: ContestsListComponent},
  {path: "contest/:address", component: ContestComponent},
  {path: "exam/:address", component: ExamComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
