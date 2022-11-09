import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { QuizService } from '../services/quiz.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.css']
})
export class QuizComponent implements OnInit {
  quizID: string = "";
  quizInfo: any;
  loaded: Boolean = true;
  titleLoaded: Boolean = true;
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
      }
    })
  }

  ngOnInit(): void {
  }

  formatDate(date: string) {

  }

  submit() {

  }

}
