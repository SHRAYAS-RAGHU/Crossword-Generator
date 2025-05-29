import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CrosswordPuzzle, ValidationRequestPayload, ValidationResponsePayload } from '../models/crossword.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CrosswordService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getCrosswordPuzzle(): Observable<CrosswordPuzzle> {
    return this.http.get<CrosswordPuzzle>(`${this.apiUrl}/crossword`);
  }

  validateAnswer(payload: ValidationRequestPayload): Observable<ValidationResponsePayload> {
    return this.http.post<ValidationResponsePayload>(`${this.apiUrl}/validate`, payload);
  }
}