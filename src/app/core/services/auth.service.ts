import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface Pet {
  id: string;
  name: string;
  type: string;
  breed?: string;
  birthDate?: Date;
}

export interface User {
  uid: string;
  name: string;
  email: string;
  pets?: Pet[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const token = localStorage.getItem('token');
    if (token) {
      this.getProfile().subscribe({
        error: () => this.logout()
      });
    }
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error inesperado';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(() => new Error(errorMessage));
  }

  register(userData: { name: string; email: string; password: string }): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users/register`, userData).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
        this.currentUserSubject.next(response.user);
      }),
      catchError(this.handleError)
    );
  }

  login(credentials: { email: string; password: string }): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users/login`, credentials).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
        this.currentUserSubject.next(response.user);
      }),
      catchError(this.handleError)
    );
  }

  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/profile`).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
} 