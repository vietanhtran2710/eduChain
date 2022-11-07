import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { Account } from '../_model/account'
import { map } from 'rxjs/operators';

const baseUrl = 'http://localhost:8080/api/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentAccountSubject: BehaviorSubject<Account>;

  constructor(private http: HttpClient) {
    this.currentAccountSubject = new BehaviorSubject<Account>(JSON.parse(localStorage.getItem('currentAccount') || '{}'));
  }

  authenticate(data: any) {
    return this.http.post(`${baseUrl}/login`, data).pipe(map(user => {
      // login successful if there's a jwt token in the response
      if (user && (user as any).token) {
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          localStorage.setItem('currentAccount', JSON.stringify(user));
          this.currentAccountSubject.next(user as any);
      }
      return user;
    }));
  }

  verifyToken() {
    return this.http.get(`${baseUrl}/token`).pipe(map(user => {
      if (user && (user as any).token) {
          localStorage.setItem('currentAccount', JSON.stringify(user));
          this.currentAccountSubject.next(user as any);
      }
      return user;
    }));
  }

  logout() {
    localStorage.removeItem('currentAccount');
    this.currentAccountSubject.next(null as any);
    location.reload()
  }
}
