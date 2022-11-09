import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { BlockchainService } from '../services/blockchain.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  eth: number = 0;
  skill: string = "";
  vnd: string = "";
  loaded: Boolean = true;
  currentAccount: string = "";
  profileAddress: string = "";
  currentAccountRole: string = "";
  nft: Array<any> = [];
  rewards: Array<any> = [];
  contestAddress: string = "";
  rewardAddress: string = "";

  constructor(private authService: AuthService,
              private blockchainService: BlockchainService,
              private route: ActivatedRoute,
  ) {
    this.profileAddress = this.route.snapshot.paramMap.get('address')!; 
    if (Object.keys(this.authService.currentUserValue).length !== 0) {
      this.authService.verifyToken().subscribe({
        next: (data: any) => {
          this.currentAccount = data.address;
          this.currentAccountRole = data.role;
          this.contestAddress = this.blockchainService.getContestFactoryAddress();
          this.rewardAddress = this.blockchainService.getRewardAddress();
          this.blockchainService.getSkillBalance(this.profileAddress)
          .then((result: any) => {
            this.skill = result;
          })
          this.blockchainService.getVNDBalance(this.profileAddress)
          .then((result: any) => {
            this.vnd = result;
          })
          this.blockchainService.getEthBalance(this.profileAddress)
          .then((result: any) => {
            this.eth = Math.round(result / Math.pow(10, 18) * 100) / 100;;
          })
          this.blockchainService.getAllRewards(this.profileAddress)
          .then((result: any) => {
            this.rewards = result;
          })
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
  }

  ngOnInit(): void {
  }

  logOut() {

  }

}
