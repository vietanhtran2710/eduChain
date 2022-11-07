import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { BlockchainService } from '../services/blockchain.service';
import { RewardService } from '../services/reward.service';
import Swal from 'sweetalert2';

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
              private blockchainService: BlockchainService,
              private rewardService: RewardService
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

          });
          this.userService.countUser().subscribe({
            next: (result: any) => {
              this.numberOfUsers = result.count;
            },
            error: (err) => {

            },
            complete: () => {

            }
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
    Swal.fire({
      title: 'Are you sure to verify this user?',
      text: `${user.fullName} at ${user.workLocation}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        this.rewardService.grantRole(user.address, user.role, this.currentAccount)
        .then(result => {
          this.userService.verifyUser(user.address).subscribe({
            next: (result) => {
              Swal.fire({
                icon: 'success',
                title: 'Account verified successfully',
                text: `${user.fullName} at ${user.workLocation}`
              })
              .then(result => {
                window.location.reload();
              })
            },
            error: (err) => {

            },
            complete: () => {

            }
          })
        })
        .catch(err => {

        })
      }
    })
  }

  formatDate(date: any) {
    let d = date.split('T')[0].split('-')
    return d[2] + "-" + d[1] + "-" + d[0]
  }

}
