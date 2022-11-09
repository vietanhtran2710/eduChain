import { Component, OnInit } from '@angular/core';
import { BlockchainService } from '../services/blockchain.service';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {
  moneyReceived: number = 0; vndSell: number = 0;
  moneySpent: number = 0; vndBuy: number = 0;
  currentAccount: string = "";
  currentVND: number = 0;
  loaded = false;

  constructor(
    private blockChainService: BlockchainService,
    private authService: AuthService
  ) {
    if (Object.keys(this.authService.currentUserValue).length !== 0) {
      this.authService.verifyToken().subscribe({
        next: (data: any) => {
          this.currentAccount = data.address;
          this.blockChainService.getVNDBalance(this.currentAccount)
          .then((result: any) => {
            this.currentVND = result;
            this.loaded = true;
          })
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

  calculateMoneyEarn() {
    this.moneyReceived = this.vndSell * 1000;
  }

  calculateVNDBuy() {
    this.vndBuy = this.moneySpent / 1000;
  }

  buyVND() {
    Swal.fire({
      title: 'Confirm payment?',
      text: `You will buy ${this.vndBuy} VNH Token with ${this.moneySpent} VND`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Confirm'
    }).then((result) => {
      if (result.isConfirmed) {
        this.blockChainService.mintVND({amount: this.vndBuy})
        .subscribe({
          next: (result: any) => {
            if (result) {
              console.log(result);
              Swal.fire(
                'Transaction sucess!',
                `Transaction hash: ${(result as any).transactionHash}`,
                'success'
              )
              .then(result => {window.location.reload})
            }
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'An error occured',
              text: `${err}`,
            })
          }
        })
      }
    })
  }

  sellVND() {
    if (this.currentVND < this.vndSell) {
      Swal.fire({
        icon: 'error',
        title: 'Not enough VNH Token',
        text: 'You don\'t have enough VNH',
      })
    }
    else {
      Swal.fire({
        title: 'Confirm payment?',
        text: `You will sell ${this.vndSell} VNH Token for ${this.moneyReceived} VND`,
        icon: 'info',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Confirm'
      }).then((result) => {
        if (result.isConfirmed) {
          this.blockChainService.burnVND({amount: this.vndSell})
          .subscribe({
            next: (result: any) => {
              if (result) {
                console.log(result);
                Swal.fire(
                  'Transaction sucess!',
                  `Transaction hash: ${(result as any).transactionHash}`,
                  'success'
                )
                .then(result => {window.location.reload})
              }
            },
            error: (err) => {
              Swal.fire({
                icon: 'error',
                title: 'An error occured',
                text: `${err}`,
              })
            }
          })
        }
      })
    }
    
  }

}
