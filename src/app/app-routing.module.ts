import { NgModule } from '@angular/core';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AdminComponent } from './admin/admin.component';
import { CourseComponent } from './course/course.component';
import { QuizComponent } from './quiz/quiz.component';

const routes: Routes = [
  {path: "", component: LandingPageComponent},
  {path: "home", component: HomeComponent},
  {path: "admin", component: AdminComponent},
  {path: "course/:id", component: CourseComponent},
  {path: "quiz/:id", component: QuizComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
