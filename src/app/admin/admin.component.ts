import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { BlockchainService } from '../services/blockchain.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  unverifiedUser: Array<any> = [];
  currentAccount: string = "";
  contestAddress: string = "";
  rewardAddress: string = "";
  numberOfUsers: number = 0;
  balances: number = 0;
  loaded = true;

  constructor(private userService: UserService,
              private authService: AuthService,
              private blockchainService: BlockchainService
  ) { 
    if (Object.keys(this.authService.currentUserValue).length !== 0) {
      this.authService.verifyToken().subscribe({
        next: (data: any) => {
          this.currentAccount = data.address;
          this.userService.getUnverifiedUser().subscribe({
            next: (result: any) => {
              this.unverifiedUser = result;
            },
            error: (err) => {
      
            },
            complete: () => {
              console.log('complete')
            }
          })
          this.blockchainService.getEthBalance(this.currentAccount)
          .then((result: any) => {
            this.balances = Math.round(result / Math.pow(10, 18) * 100) / 100;
          })
          .catch((err) => {

          })
          this.contestAddress = this.blockchainService.getContestFactoryAddress();
          this.rewardAddress = this.blockchainService.getRewardAddress();
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
    this.authService.logout();
  }

  verify(user: any) {

  }

  formatDate(date: any) {
    let d = date.split('T')[0].split('-')
    return d[2] + "-" + d[1] + "-" + d[0]
  }

}
