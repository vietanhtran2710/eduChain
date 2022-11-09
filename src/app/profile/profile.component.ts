import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  eth: string = "";
  kng: string = "";
  vnh: string = "";
  loaded: Boolean = true;
  currentAccount: string = "";
  currentAccountRole: string = "";
  nft: Array<any> = [];
  rewards: Array<any> = [];

  constructor(private authService: AuthService) { 
    if (Object.keys(this.authService.currentUserValue).length !== 0) {
      this.authService.verifyToken().subscribe({
        next: (data: any) => {
          this.currentAccount = data.address;
          this.currentAccountRole = data.role;
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
    else {
    }
  }

  ngOnInit(): void {
  }

  logOut() {

  }

}
