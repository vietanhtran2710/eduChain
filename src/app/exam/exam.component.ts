import { Component, OnInit } from '@angular/core';
import { ContestService } from '../services/contest.service';
import { BlockchainService } from '../services/blockchain.service';
import { AuthService } from '../services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-exam',
  templateUrl: './exam.component.html',
  styleUrls: ['./exam.component.css']
})
export class ExamComponent implements OnInit {
  contestInfo: any;
  contestAddress: string = "";
  currentAccount: string = "";
  currentAccountRole: string = "";
  testStarted = false;
  loaded: Boolean = false;
  submission: Array<any> = [];
  answers = ['A', 'B', 'C', 'D'];
  time = 0; interval: any;

  constructor(
    private contestService: ContestService,
    private blockchainService: BlockchainService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
  ) { 
    this.contestAddress = this.route.snapshot.paramMap.get('address')!;
    if (Object.keys(this.authService.currentUserValue).length !== 0) {
      this.authService.verifyToken().subscribe({
        next: (data: any) => {
          this.currentAccount = data.address;
          this.currentAccountRole = data.role;
          if (this.currentAccountRole != "STUDENT") {
            this.router.navigate([`/contest/${this.contestAddress}`]);
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
    this.contestService.getContestQuestions(this.contestAddress).subscribe({
      next: (result: any) => {
        this.contestInfo = result;
        this.loaded = true;
      }
    })
  }

  ngOnInit(): void {
  }

  startTest() {
    this.testStarted = true;
    this.interval = setInterval(() => {
      this.time++;
    }, 1000)
  }

  submit() {
    console.log(this.submission);
    clearInterval(this.interval);
    let studentAnswer = this.submission.join("");
    this.blockchainService.submitAnswer(this.contestAddress, this.currentAccount, studentAnswer, this.time)
    .then((result) => {
      console.log(result);
      Swal.fire({
        icon: 'success',
        title: 'Answer submitted successfully',
        text: `Your grade has been saved`
      })
      .then(result => {
        window.location.reload();
      })
    })
    .catch((err) => {
      Swal.fire({
        icon: 'error',
        title: 'Cannot submit answer',
        text: err,
      })
    })
  }

}
