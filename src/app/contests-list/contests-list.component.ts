import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { BlockchainService } from '../services/blockchain.service';
import { ContestService } from '../services/contest.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-contests-list',
  templateUrl: './contests-list.component.html',
  styleUrls: ['./contests-list.component.css']
})
export class ContestsListComponent implements OnInit {

  contests: Array<any> = [];
  contestAddress: string = "";
  rewardAddress: string = "";
  loaded: Boolean = true;
  answer: string = "";
  questions: Array<string> = [];
  choices: Array<string> = [];
  contestModel: FormGroup;
  currentAccount: string = "";
  currentAccountRole: string = "";

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private blockchainService: BlockchainService,
    private contestService: ContestService
  ) { 
    this.contestModel = this.fb.group({
      title: '',
      description: ''
    })
    if (Object.keys(this.authService.currentUserValue).length !== 0) {
      this.authService.verifyToken().subscribe({
        next: (data: any) => {
          this.currentAccount = data.address;
          this.currentAccountRole = data.role;
          if (this.currentAccountRole == "SPONSOR") {
            this.contestService.getAllContest().subscribe({
              next: (data: any) => {
                this.contests = data;
              }
            })
          }
        }
      })
    }
    else {
      
    }
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

  createContest() {
    console.log(this.answer);
    console.log(this.questions);
    console.log(this.choices);
    this.blockchainService.createContest(this.answer, this.currentAccount)
    .then((transactions: any) => {
      console.log(transactions);
      let contestAddress = transactions.events.CreatedContest.returnValues.contestAddress;
      this.contestService.createContest({
        address: contestAddress,
        description: this.contestModel.get('description')?.value,
        title: this.contestModel.get('title')?.value,
        questions: this.questions,
        choices: this.choices
      })
      .subscribe({
        next: (result) => {
          Swal.fire({
            icon: 'success',
            title: 'Contest created successfully',
            text: `${this.contestModel.get('title')?.value} created at address ${contestAddress}`
          })
          .then(result => {
            window.location.reload();
          })
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Cannot create contest',
            text: err,
          })
        },
        complete: () => {

        }
      })
    })
  }

  navigateToContest(contestAddress: string) {

  }

}
