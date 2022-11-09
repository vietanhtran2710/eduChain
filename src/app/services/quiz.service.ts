import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const baseUrl = 'http://localhost:8080/api/quiz';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  constructor(private http: HttpClient) { }

  createQuiz(data: any) {
    return this.http.post(baseUrl, data)
  }

  getCourseQuiz(courseID: string) {
    return this.http.get(`${baseUrl}/course/${courseID}`)
  }
}
