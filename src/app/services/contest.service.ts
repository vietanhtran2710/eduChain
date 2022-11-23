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

  getAllContest() {
    return this.http.get(`${baseUrl}/contests`)
  }

  getContestContestants(contestAddress: string) {
    return this.http.get(`${baseUrl}/contestant/${contestAddress}`);
  }

  getOne(contestAddress: string) {
    return this.http.get(`${baseUrl}/one/${contestAddress}`);
  }

  getContestQuestions(contestAddress: string) {
    return this.http.get(`${baseUrl}/question/${contestAddress}`);
  }

  getStudentRegisteredContests(studentAddress: string) {
    return this.http.get(`${baseUrl}/registered/${studentAddress}`);
  }

  registerStudent(data: any) {
    return this.http.post(`${baseUrl}/register`, data)
  }

  endContest(address: string) {
    return this.http.put(`${baseUrl}/end/${address}`, {});
  }
}
