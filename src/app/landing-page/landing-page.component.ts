import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

const Web3 = require('web3')

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  web3: any;
  registerModel: FormGroup

  constructor(private fb: FormBuilder,
              private userService: UserService,
              private authService: AuthService,
              private router: Router) 
  {
    if (Object.keys(this.authService.currentUserValue).length !== 0) {
      this.authService.verifyToken().subscribe({
        next: (data: any) => {
          if (data.role != "ADMIN") {
            this.router.navigate([`/home`])
          }
          else {
            this.router.navigate([`/admin`])
          }
        },
        error: (err) => {

        },
        complete: () => {

        }
      })
    }
    this.registerModel = this.fb.group({
      walletAddress: '',
      role: '',
      fullName: '',
      email: '',
      workLocation: '',
      dateOfBirth: '',
    })
  }

  ngOnInit(): void {

  }

  handleSignMessage = ({ publicAddress, nonce }: {publicAddress: string; nonce: string}) => {
    return new Promise((resolve, reject) =>
      this.web3.eth.personal.sign(
        `You are signing your one-time nonce to login: ${nonce}`,
        publicAddress,
        (err: any, signature: any) => {
          if (err) return reject(err);
          return resolve({ publicAddress, signature });
        }
      )
    );
  };

  async login() {
    if (!(window as any).ethereum) {
			window.alert('Please install MetaMask first.');
			return;
		}

		if (!this.web3) {
			try {
				await (window as any).ethereum.enable();

				this.web3 = new Web3((window as any).ethereum);
			} catch (error) {
				window.alert('You need to allow MetaMask.' + error);
				return;
			}
		}

		const coinbase = await this.web3.eth.getCoinbase();
    console.log(coinbase);
    let that = this;
    this.userService.getNonce(coinbase).subscribe({
      next: (result) => {
        if (result == null) {
          Swal.fire({
            position: 'top-end',
            icon: 'error',
            title: 'Cannot sign in',
            text: "Account address not registered",
            footer: '<a href>Need help?</a>',
            width: "400px",
          })
        }
        else {
          this.handleSignMessage({publicAddress: coinbase, nonce: (result as any).nonce})
          .then((data) => {
            that.authService.authenticate(data).subscribe({
              next: (result: any) => {
                if (result.role != "ADMIN") {
                  this.router.navigate([`/home`])
                }
                else {
                  this.router.navigate([`/admin`])
                }
              },
              error: (err) => {
                Swal.fire({
                  position: 'top-end',
                  icon: 'error',
                  title: 'Không thể đăng nhập',
                  text: err.error.message,
                  footer: '<a href>Need help?</a>',
                  width: "400px",
                })
              },
              complete: () => {
                console.log('complete');
              }
            })
          })
        }
      },
      error: (err) => {
        Swal.fire({
          position: 'top-end',
          icon: 'error',
          title: 'Cannot sign in',
          text: "An error has occured: " + err,
          footer: '<a href>Need help?</a>',
          width: "400px",
        })
      },
      complete: () => {
        console.log('Complete');
      }
    });
  }

  register() {
    console.log(this.registerModel);
    let registerInfo = {
      address: this.registerModel.get('walletAddress')?.value,
      role: this.registerModel.get('role')?.value,
      fullName: this.registerModel.get('fullName')?.value,
      email: this.registerModel.get('email')?.value,
      workLocation: this.registerModel.get('workLocation')?.value,
      dateOfBirth: this.registerModel.get('dateOfBirth')?.value,
    }
    this.userService.createAccount(registerInfo).subscribe(
      {
        next: (result) => {
          let message = 'Have fun learning!';
          if (registerInfo.role != "STUDENT") {
            message += 'Please wait for admin\'s verification.'
          }
          Swal.fire({
            icon: 'success',
            title: 'Account registered successfully',
            text: message
          })
        },
        error: (err) => {
          Swal.fire({
            icon: 'error',
            title: 'Cannot register',
            text: err,
          })
        },
        complete: () => {
          console.log('complete')
        }
      }
    )
  }

}
