import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CourseService } from '../services/course.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { QuizService } from '../services/quiz.service';
import { FormBuilder, FormGroup } from '@angular/forms';
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
  testModel: FormGroup;
  answer: string = "";
  questions: Array<string> = [];
  choices: Array<string> = [];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private sanitizer: DomSanitizer,
              private fb: FormBuilder,
              private courseService: CourseService,
              private quizService: QuizService
  ) {
    this.testModel = this.fb.group({
      title: '',
      week: '',
      description: ''
    })
    this.courseId = this.route.snapshot.paramMap.get('id')!;
    this.courseService.getOneCourse(this.courseId).subscribe({
      next: (data: any) => {
        this.courseInfo = data;
        this.weeks = Array(this.courseInfo.week).fill(1).map((x, i)=>i + 1);
        console.log(this.courseInfo)
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

  navigateToExercise() {

  }
}
