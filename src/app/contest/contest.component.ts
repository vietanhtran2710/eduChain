import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { BlockchainService } from '../services/blockchain.service';
import { ContestService } from '../services/contest.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

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
  registerModel: FormGroup;
  registerList: Array<string> = [];
  sponsoring: Boolean = false;

  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private blockchainService: BlockchainService,
    private contestService: ContestService,
    private fb: FormBuilder
  ) {
    this.registerModel = this.fb.group({
      address: ''
    });
    this.contestAddress = this.route.snapshot.paramMap.get('address')!;
    if (Object.keys(this.authService.currentUserValue).length !== 0) {
      this.contestFactoryAddress = this.blockchainService.getContestFactoryAddress();
      this.rewardAddress = this.blockchainService.getRewardAddress();
      this.authService.verifyToken().subscribe({
        next: (data: any) => {
          this.currentAccount = data.address;
          this.currentAccountRole = data.role;
          if (this.currentAccountRole == "SPONSOR") {
            this.blockchainService.isSponsoring(this.currentAccount, this.contestAddress)
            .then((result: any) => {
              this.sponsoring = result;
            })
          }
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

  fileChosen(event: any) {
    if (event.target.value) {
      const reader = new FileReader()
      new Promise((resolve, reject) => {
        reader.onload = event => resolve(event.target?.result?.toString())
        reader.onerror = error => reject(error)
        reader.readAsText(event.target?.files[0]);
      }).then((result) => {
        this.registerList = (result as string).trim().split('\n');
      })
      .catch(err => {

      })
    }
  }

  sponsor() {
    Swal.fire({
      title: 'Are you sure to sponsor this contest?',
      text: `You need to approve the contest contract to transfer your registered reward to the contest winner`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
    }).then((result) => {
      if (result.isConfirmed) {
        this.blockchainService.approveForContract(this.contestAddress, this.currentAccount)
        .then((result: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: `Sponsored and approved for contest contract`
          })
          .then(result => {
            window.location.reload();
          })
        })
        .catch((err: any) => {
          Swal.fire({
            icon: 'error',
            title: 'Cannot approve',
            text: err,
          })
        })
      }
    })
  }

  register() {
    if (this.registerModel.get('address')?.value != '') {
      this.registerList.push(this.registerModel.get('address')?.value);
    }
    if (this.registerList.length != 0) {
      this.blockchainService.register(this.registerList, this.contestAddress, this.currentAccount)
      .then((result) => {
        if (result) {
          this.contestService.registerStudent({
            contestAddress: this.contestAddress,
            students: this.registerList
          }).subscribe({
            next: (data: any) => {
              Swal.fire({
                icon: 'success',
                title: 'Registered students successfully',
                text: `${this.registerList.length} registered`
              })
              .then(result => {
                window.location.reload();
              })
            },
            error: (err: any) => {
              Swal.fire({
                icon: 'error',
                title: 'Cannot register',
                text: err,
              })
            },
            complete: () => {

            }
          })
        }
      })
    }
  }

  endContest() {

  }

  takeExam() {

  }

  formatDate(date: string) {
    let d = date.split('T')[0].split('-');
    return d[2] + "-" + d[1] + "-" + d[0]
  }

}
