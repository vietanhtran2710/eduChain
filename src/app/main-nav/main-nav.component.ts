import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { CourseService } from '../services/course.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, RouteReuseStrategy } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent implements OnInit {
  courseModel: FormGroup;
  file: File | undefined;
  currentAccount: string = "";
  currentAccountRole: string = "";

  constructor(
    private authService: AuthService,
    private courseService: CourseService,
    private router: Router,
    private fb: FormBuilder
  ) {
    if (Object.keys(this.authService.currentUserValue).length !== 0) {
      this.authService.verifyToken().subscribe({
        next: (data: any) => {
          this.currentAccount = data.address;
          this.currentAccountRole = data.role;
          if (this.currentAccountRole == "TEACHER") {
            
          }
          else if (this.currentAccountRole == "STUDENT") {
            
          }
        },
        error: (err) => {

        },
        complete: () => {

        }
      })
    }
    this.courseModel = this.fb.group({
      title: '',
      week: '',
      description: '',
      fee: '',
      grade: '',
      reward: '',
    })
  }

  ngOnInit(): void {
  }

  fileChosen(event: any) {
    if (event.target.value) {
      this.file = <File>event.target.files[0];
    }
  }

  navigateToProfile() {
    this.router.navigate([`profile/${this.currentAccount}`])
  }

  createCourse() {
    var formData = new FormData();
    if (this.file) {
      formData.append('file', this.file, this.file.name);
      formData.append('title', this.courseModel.get('title')!.value);
      formData.append('week', this.courseModel.get('week')!.value);
      formData.append('description', this.courseModel.get('description')!.value);
      formData.append('fee', this.courseModel.get('fee')!.value);
      formData.append('grade', this.courseModel.get('grade')!.value);
      formData.append('reward', this.courseModel.get('reward')!.value);
      this.courseService.createCourse(formData).subscribe({
        next: (result) => {
          Swal.fire({
            icon: 'success',
            title: 'Course created successfully',
            text: `Have fun teaching!`
          })
          .then(result => {
            window.location.reload();
          })
        },
        error: (err) => {

        },
        complete: () => {

        }
      })
    }
    else {

    }
  }



  logOut() {
    this.authService.logout();
  }

}
