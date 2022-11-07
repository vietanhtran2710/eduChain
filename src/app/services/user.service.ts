import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const baseUrl = 'http://localhost:8080/api/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  createAccount(data: any) {
    return this.http.post(baseUrl, data)
  }

  getNonce(address: string) {
    return this.http.get(`${baseUrl}/nonce/${address}`)
  }

  getUnverifiedUser() {
    return this.http.get(`${baseUrl}/unverified/`)
  }
}
