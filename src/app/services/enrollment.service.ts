import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const baseUrl = 'http://localhost:8080/api/enrollment';

@Injectable({
  providedIn: 'root'
})
export class EnrollmentService {

  constructor(private http: HttpClient) { }

  getEnrolledCourse(userAddress: string) {
    return this.http.get(`${baseUrl}/enrolled/${userAddress}`)
  }

  getUnenrolledCourse(userAddress: string) {
    return this.http.get(`${baseUrl}/unenrolled/${userAddress}`)
  }
}
