import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const baseUrl = 'http://localhost:8080/api/certificate';

@Injectable({
  providedIn: 'root'
})
export class CertificateService {

  constructor(private http: HttpClient) { }

  getOne(hash: string) {
    return this.http.get(`${baseUrl}/${hash}`)
  }

  findOne(address: string, courseID: string) {
    return this.http.get(`${baseUrl}/find/${address}&${courseID}`)
  }
}
