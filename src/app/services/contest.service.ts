import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const baseUrl = 'http://localhost:8080/api/contest';

@Injectable({
  providedIn: 'root'
})
export class ContestService {

  constructor(private http: HttpClient) { }

  createContest(data: any) {
    return this.http.post(baseUrl, data)
  }
}
