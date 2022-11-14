import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { BlockchainService } from '../services/blockchain.service';
import { ContestService } from '../services/contest.service';

@Component({
  selector: 'app-contest',
  templateUrl: './contest.component.html',
  styleUrls: ['./contest.component.css']
})
export class ContestComponent implements OnInit {

  contestants: Array<any> = [];
  loaded: Boolean = false;
  contestantLoaded: Boolean = false;
  contestInfo: any;
  contestAddress: string = "";
  rewardAddress: string = "";
  currentAccount: string = "";
  currentAccountRole: string = "";
  total: number = 0;
  nftRewardCount: number = 0;
  results: Array<any> = [];
  contestFactoryAddress: string = "";

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private blockchainService: BlockchainService,
    private contestService: ContestService
  ) {
    this.contestAddress = this.route.snapshot.paramMap.get('address')!;
    if (Object.keys(this.authService.currentUserValue).length !== 0) {
      this.contestFactoryAddress = this.blockchainService.getContestFactoryAddress();
      this.rewardAddress = this.blockchainService.getRewardAddress();
      this.authService.verifyToken().subscribe({
        next: (data: any) => {
          this.currentAccount = data.address;
          this.currentAccountRole = data.role;
        }
      })
      this.blockchainService.getAllContestRewards(this.contestAddress)
      .then((result: any) => {
        this.total = result[0];
        this.nftRewardCount = result[1].length;
      })
      this.contestService.getOne(this.contestAddress).subscribe({
        next: (data: any) => {
          this.contestInfo = data;
          this.loaded = true;
        }
      })
      this.contestService.getContestContestants(this.contestAddress).subscribe({
        next: (data: any) => {
          this.contestants = data.registration;
          this.contestantLoaded = true;
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
