import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserService } from '../services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {

  registerModel: FormGroup

  constructor(private fb: FormBuilder,
              private userService: UserService) {
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
