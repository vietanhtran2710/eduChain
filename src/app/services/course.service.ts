import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const baseUrl = 'http://localhost:8080/api/course';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  constructor(private http: HttpClient) { }

  createCourse(data: any) {
    return this.http.post(baseUrl, data)
  }

  getUserCourse(userAddress: string) {
    return this.http.get(`${baseUrl}/teacher/${userAddress}`)
  }

  getCourseImage(id: string) {
    return this.http.get(`${baseUrl}/download/${id}`, {responseType: `blob`})
  }

  getOneCourse(id: string) {
    return this.http.get(`${baseUrl}/one/${id}`)
  }
}
