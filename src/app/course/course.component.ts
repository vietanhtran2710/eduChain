import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CourseService } from '../services/course.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { QuizService } from '../services/quiz.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { EnrollmentService } from '../services/enrollment.service';
import { CertificateService } from '../services/certificate.service';
import { BlockchainService } from '../services/blockchain.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {
  courseId: string = "";
  courseInfo: any;
  courseImage: any;
  weeks: Array<any> = [];
  courseStudents: Array<any> = [];
  testModel: FormGroup;
  answer: string = "";
  questions: Array<string> = [];
  choices: Array<string> = [];
  currentAccount: string = "";
  currentAccountRole: string = "";
  enrollStatus: Boolean = false;
  studentLoaded: Boolean = false;
  courseLoaded: Boolean = false;
  courseQuizes: Array<Array<any>> = [];
  courseStatus: number = 0;
  courseCertificate: Array<any> = [];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private sanitizer: DomSanitizer,
              private fb: FormBuilder,
              private courseService: CourseService,
              private quizService: QuizService,
              private authService: AuthService,
              private enrollmentService: EnrollmentService,
              private blockchainService: BlockchainService,
              private certificateService: CertificateService
  ) {
    this.courseId = this.route.snapshot.paramMap.get('id')!;
    if (Object.keys(this.authService.currentUserValue).length !== 0) {
      this.authService.verifyToken().subscribe({
        next: (data: any) => {
          this.currentAccount = data.address;
          this.currentAccountRole = data.role;
          if (this.currentAccountRole == "TEACHER") {
            this.enrollStatus = true;
          }
          else if (this.currentAccountRole == "STUDENT") {
            this.enrollmentService.getUserEnrollmentStatus(this.currentAccount, this.courseId).subscribe({
              next: (res: any) => {
                this.enrollStatus = res.enrolled;
              }
            })
            this.quizService.checkCourseStatus(this.currentAccount, this.courseId).subscribe({
              next: (result: any) => {
                this.courseStatus = result.status;
              }
            })
          }
          this.certificateService.getCourseCertificate(this.courseId).subscribe({
            next: (result: any) => {
              this.courseCertificate = result;
            }
          })
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
    this.testModel = this.fb.group({
      title: '',
      week: '',
      description: ''
    })
    this.enrollmentService.getCourseStudents(this.courseId).subscribe({
      next: (result: any) => {
        this.courseStudents = result.student;
        this.studentLoaded = true;
      }
    })
    this.courseService.getOneCourse(this.courseId).subscribe({
      next: (data: any) => {
        this.courseInfo = data;
        this.weeks = Array(this.courseInfo.week).fill(1).map((x, i)=>i + 1);
        console.log(this.courseQuizes);
        this.quizService.getCourseQuiz(this.courseId).subscribe({
          next: (result: any) => {
            console.log(result);
            this.courseQuizes = [];
            for(var i: number = 0; i < this.courseInfo.week; i++) {
                this.courseQuizes[i] = [];
            }
            for (let item of result) {
              this.courseQuizes[item.week - 1].push(item);
            }
          }
        })
        this.courseLoaded = true;
      }
    })
    this.courseService.getCourseImage(this.courseId).subscribe({
      next: (image) => {
        this.courseImage = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(image))
      }
    })
  }

  ngOnInit(): void {
  }

  fileChosen(event: any) {
    if (event.target.value) {
      const reader = new FileReader()
      new Promise((resolve, reject) => {
        reader.onload = event => resolve(event.target?.result?.toString())
        reader.onerror = error => reject(error)
        reader.readAsText(event.target?.files[0]);
      }).then((result) => {
        let lines = (result as string).trim().split('\n');
        this.answer = lines[0];
        for (let i = 1; i < lines.length; i += 5) {
          this.questions.push(lines[i]);
          this.choices.push(lines[i + 1] + ";" + lines[i + 2] + ";" + lines[i + 3] + ";" + lines[i + 4])
        }
      })
      .catch(err => {

      })
    }
  }

  createTest() {
    this.quizService.createQuiz({
      title: this.testModel.get('title')?.value,
      week: this.testModel.get('week')?.value,
      description: this.testModel.get('description')?.value,
      questions: this.questions,
      choices: this.choices,
      answer: this.answer,
      course: this.courseId
    })
    .subscribe({
      next: (result) => {
        Swal.fire({
          icon: 'success',
          title: 'Quiz created successfully',
          text: `${this.testModel.get('title')?.value} at week ${this.testModel.get('week')?.value}`
        })
        .then(result => {
          window.location.reload();
        })
      }
    })
  }

  navigateToQuiz(id: number) {
    this.router.navigate([`/quiz/${id}`]);
  }

  formatDate(date: string) {
    let d = date.split('T')[0].split('-');
    return d[2] + "-" + d[1] + "-" + d[0]
  }

  enroll() {
    Swal.fire({
      title: 'Are you sure to enroll this course?',
      text: `${this.courseInfo.name}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        if (this.courseInfo.fee != 0) {

        }
        else {
          this.enrollmentService.enroll({courseID: this.courseId}).subscribe({
            next: (result) => {
              Swal.fire({
                icon: 'success',
                title: 'Enrolled successfully',
                text: `Have fun learning ${this.courseInfo.name}`
              })
              .then(result => {
                window.location.reload();
              })
            },
            error: (err) => {
              Swal.fire({
                icon: 'error',
                title: 'Cannot enroll',
                text: err,
              })
            },
            complete: () => {
    
            }
          })
        }
      }
    });
  }

  claim() {
    this.quizService.claimCertificate(this.courseId)
    .subscribe({
      next: (result) => {
        Swal.fire({
          icon: 'success',
          title: 'Congratulations',
          text: `You earned your certificate and reward`
        })
        .then(result => {
          window.location.reload();
        })
      },
      error: (err) => {
        Swal.fire({
          icon: 'error',
          title: 'Cannot enroll',
          text: err,
        })
      }
    })
  }

  view() {
    this.certificateService.findOne(this.currentAccount, this.courseId).subscribe({
      next: (result: any) => {
        this.router.navigate([`view/${result.hash}`])
      }
    })
  }

  viewFromHash(hash: string) {
    this.router.navigate([`view/${hash}`])
  }

  toBoolean(value: number) {
    if (value == 1) return true;
    else return false;
  }

  revoke(hash: string) {
    Swal.fire({
      title: "Are you sure to revoke this certificate?",
      text: "Provide a reason:",
      input: 'text',
      icon: 'question',
      showCancelButton: true        
    }).then((result) => {
        if (result.value && result.isConfirmed) {
          this.blockchainService.revokeCertificate(hash, result.value, this.currentAccount)
          .then((result: any) => {
            this.certificateService.revoke(hash).subscribe({
              next: (result: any) => {
                Swal.fire({
                  icon: 'success',
                  title: 'Certificate revoked',
                  text: `Hash: ${hash}`
                })
                .then(result => {
                  window.location.reload();
                })
              },
              error: (err: any) => {
                Swal.fire({
                  icon: 'error',
                  title: 'Cannot revoke',
                  text: err,
                })
              },
              complete: () => {

              }
            })
          })
        }
    });
  }
}
