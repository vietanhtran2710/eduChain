import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CourseService } from '../services/course.service';
import { Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentAccount: string = "";
  currentAccountRole: string = "";
  title: string = "";
  courses: Array<any> = [];

  constructor(private authService: AuthService,
              private courseService: CourseService,
              private sanitizer: DomSanitizer,
              private router: Router
  ) { 
    if (Object.keys(this.authService.currentUserValue).length !== 0) {
      this.authService.verifyToken().subscribe({
        next: (data: any) => {
          this.currentAccount = data.address;
          this.currentAccountRole = data.role;
          if (this.currentAccountRole == "TEACHER") {
            this.title = "YOUR COURSES";
            this.courseService.getUserCourse(this.currentAccount).subscribe({
              next: (result: any) => {
                this.courses = result;
                for (let index = 0; index < this.courses.length; index++) {
                  this.courseService.getCourseImage(this.courses[index].courseID).subscribe({
                    next: (image) => {
                      this.courses[index].image = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(image))
                    }
                  })
                }
              },
              error: (err) => {

              },
              complete: () => {

              }
            })
          }
        },
        error: (err) => {

        },
        complete: () => {

        }
      })
    }
    else {
      this.router.navigate([``])
    }
  }

  ngOnInit(): void {

  }

  navigateToCourse(id: number) {

  }

}
