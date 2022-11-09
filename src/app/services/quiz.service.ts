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
    return this.http.get(`${baseUrl}/course/${courseID}`);
  }

  getQuizQuestions(quizID: string) {
    return this.http.get(`${baseUrl}/question/${quizID}`);
  }

  submit(data: any) {
    return this.http.post(`${baseUrl}/grade`, data)
  }

  checkCourseStatus(address: string, courseID: string) {
    return this.http.get(`${baseUrl}/status/${address}&${courseID}`)
  }

  claimCertificate(courseID: string) {
    return this.http.post(`${baseUrl}/claim/${courseID}`, {})
  }
}
