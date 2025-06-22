import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';
import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8000/api';
  private tokenKey = 'jwt_token';
  private loggedin = new BehaviorSubject<boolean>(this.hasToken())

  constructor(private http: HttpClient, private router: Router) { }
  isLoggedIn(): Observable<boolean> {
    return this.loggedin.asObservable();
  }

  hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }


  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.access_token);
        this.loggedin.next(true);
      }),
      catchError(error => {
        console.error('Login failed:', error);
        throw error; // Propaga o erro
      })
    );
  }


  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.access_token);
        this.loggedin.next(true);
      }),
      catchError(error => {
        console.error('Registration failed:', error);
        throw error;
      })
    );
  }

  getMe(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/me`, {});
  }




}
