import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CourseService } from '../services/course.service';
import { EnrollmentService } from '../services/enrollment.service';
import { UserService } from '../services/user.service';
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
  secondTitle: string = "";
  courses: Array<any> = [];
  enrolledCourse: Array<any> = [];
  unenrolledCourses: Array<any> = [];
  searchAddress: string = "";
  followedStudent: Array<any> = [];

  constructor(private authService: AuthService,
              private courseService: CourseService,
              private enrollmentService: EnrollmentService,
              private userService: UserService,
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
          else if (this.currentAccountRole == "STUDENT") {
            this.title = "YOUR ENROLLED COURSE";
            this.secondTitle = "EXPLORE MORE COURSE";
            this.enrollmentService.getEnrolledCourse(this.currentAccount).subscribe({
              next: (result: any) => {
                console.log(result);
                this.courses = result.enroll;
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
            this.enrollmentService.getUnenrolledCourse(this.currentAccount).subscribe({
              next: (result: any) => {
                this.unenrolledCourses = result;
                for (let index = 0; index < this.unenrolledCourses.length; index++) {
                  this.courseService.getCourseImage(this.unenrolledCourses[index].courseID).subscribe({
                    next: (image) => {
                      this.unenrolledCourses[index].image = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(image))
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
            this.secondTitle = "YOUR STUDENTS";
            this.userService.getFollowingUsers(this.currentAccount).subscribe({
              next: (result: any) => {
                this.followedStudent = result.following;
                console.log(this.followedStudent);
              }
            })
          }
        },
        error: (err) => {
          this.router.navigate([``])
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

  goToProfile() {
    this.router.navigate([`profile/${this.searchAddress}`])
  }

  navigateToProfile(address: string) {
    this.router.navigate([`profile/${address}`])
  }

  navigateToCourse(id: number) {
    this.router.navigate([`course/${id}`])
  }

}
