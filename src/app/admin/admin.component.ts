import { Component, OnInit } from '@angular/core';
import { UserService } from '../services/user.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  unverifiedUser: Array<any> = [];
  currentAccount: string = "";
  numberOfUsers: number = 0;
  balances: number = 0;
  loaded = true;

  constructor(private userService: UserService,
              private authService: AuthService) { 
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
