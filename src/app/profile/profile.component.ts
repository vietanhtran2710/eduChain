import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { BlockchainService } from '../services/blockchain.service';
import { UserService } from '../services/user.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

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
  rewardModel: FormGroup;
  nftModel: FormGroup

  constructor(private authService: AuthService,
              private fb: FormBuilder,
              private blockchainService: BlockchainService,
              private route: ActivatedRoute,
              private userService: UserService
  ) {
    this.profileAddress = this.route.snapshot.paramMap.get('address')!;
    this.rewardModel = this.fb.group({
      skill: 0,
      vnd: 0
    })
    this.nftModel = this.fb.group({
      name: '',
      link: '',
      value: 0,
    })
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
          this.blockchainService.getOwnedNFTs(this.profileAddress)
          .then((result: any) => {
            this.nft = result;
            console.log(result);
          })
          if (this.currentAccountRole == "TEACHER") {

          }
          else if (this.currentAccountRole == "STUDENT") {
            
          }
          else {
            
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

  createReward() {
    this.blockchainService.createReward(
      this.profileAddress, 
      this.rewardModel.get('skill')?.value,
      this.rewardModel.get('vnd')?.value,
      this.currentAccount
    )
    .then((result) => {
      Swal.fire({
        icon: 'success',
        title: 'Reward created successfully',
        text: `${this.profileAddress}`
      })
      .then((result: any) => {
        window.location.reload();
      })
    })
  }

  createNFT() {
    let uri = this.nftModel.get('name')?.value + ";" + this.nftModel.get('link')?.value + ";" + this.nftModel.get('value')?.value;
    this.blockchainService.createNFT(this.currentAccount, uri)
    .then((result: any) => {
      if (result) {
        Swal.fire(
          'Create NFT success!',
          `Transaction: ${(result as any).transactionHash}`,
          'success'
        )
        .then(result => {window.location.reload()})
      }
    })
  }

  followUser() {
    Swal.fire({
      title: 'Are you sure to follow this user?',
      text: `${this.profileAddress}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then((result: any) => {
      if (result.isConfirmed) {
        this.userService.follow({address: this.profileAddress}).subscribe({
          next: (result) => {
            Swal.fire({
              icon: 'success',
              title: 'User followed successfully',
              text: `${this.profileAddress}`
            })
            .then((result: any) => {
              window.location.reload();
            })
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Cannot follow',
              text: err,
            })
          }
        })
      }
      
    })
  }

}
