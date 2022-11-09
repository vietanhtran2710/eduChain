import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { QuizService } from '../services/quiz.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  quizID: string = "";
  quizInfo: any;
  loaded: Boolean = false;
  submission: Array<any> = [];
  answers = ['A', 'B', 'C', 'D'];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private quizService: QuizService
  ) { 
    this.quizID = this.route.snapshot.paramMap.get('id')!;
    this.quizService.getQuizQuestions(this.quizID).subscribe({
      next: (result) => {
        this.quizInfo = result;
        this.submission = Array(this.quizInfo.questions.length).fill("");
        this.loaded = true;
      }
    })
  }

  ngOnInit(): void {
  }

  formatDate(date: string) {

  }

  submit() {
    Swal.fire({
      title: 'Are you sure to finish the quiz?',
      text: `Your answer: ${this.submission.join("; ")}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.quizService.submit({
          answer: this.submission.join(""),
          quizID: this.quizID
        }).subscribe({
          next: (result: any) => {
            Swal.fire({
              icon: 'success',
              title: 'Answer submitted successfully',
              text: `Your grade: ${result.grade}`
            })
            .then(result => {
              this.router.navigate([`course/${this.quizInfo.course.courseID}`]);
            })
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Cannot submit',
              text: err,
            })
          },
          complete: () => {
    
          }
        })
      }
    })
  }

}
