import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-contest',
  templateUrl: './contest.component.html',
  styleUrls: ['./contest.component.css']
})
export class ContestComponent implements OnInit {

  contestants: Array<any> = [];
  loaded: Boolean = false;
  contestInfo: any;
  contestAddress: string = "";
  rewardAddress: string = "";
  currentAccount: string = "";
  currentAccountRole: string = "";
  total: number = 0;
  nftRewardCount: number = 0;
  results: Array<any> = [];


  constructor(private authService: AuthService) { 
    if (Object.keys(this.authService.currentUserValue).length !== 0) {
      this.authService.verifyToken().subscribe({
        next: (data: any) => {
          this.currentAccount = data.address;
          this.currentAccountRole = data.role;
        }
      })
    }
    else {
      
    }
  }

  ngOnInit(): void {
  }

  endContest() {

  }

  takeExam() {
    
  }

  formatDate(date: string) {

  }

}
