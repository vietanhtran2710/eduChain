import { Component, OnInit } from '@angular/core';
import { ContestService } from '../services/contest.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.css']
})
export class ExamComponent implements OnInit {
  contestInfo: any;
  contestAddress: string = "";
  loaded: Boolean = false;
  submission: Array<any> = [];
  answers = ['A', 'B', 'C', 'D'];

  constructor(
    private contestService: ContestService,
    private route: ActivatedRoute
  ) { 
    this.contestAddress = this.route.snapshot.paramMap.get('address')!;
    this.contestService.getContestQuestions(this.contestAddress).subscribe({
      next: (result: any) => {
        this.contestInfo = result;
        this.loaded = true;
      }
    })
  }

  ngOnInit(): void {
  }

  submit() {
    console.log(this.submission);
  }

}
