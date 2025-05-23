import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CrosswordService {
  private baseUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  getCrossword() {
    return this.http.get<any>(`${this.baseUrl}/generate`);
  }

  validateAnswers(answers: any) {
    return this.http.post<any>(`${this.baseUrl}/validate`, { answers });
  }
}
