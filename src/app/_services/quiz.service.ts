import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private apiUrl = 'https://gabarita-backend.onrender.com/api/';

  constructor(private http: HttpClient) {}

  // Submeter quiz ao backend
  submitQuiz(quizId: string, score: number, correctAnswers: number, wrongAnswers: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post(
      `${this.apiUrl}quiz/submit`,
      { quizId, score, correctAnswers, wrongAnswers },
      { headers }
    );
  }
}
