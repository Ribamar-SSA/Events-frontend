import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Route, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8000/api';
  private tokenKey = 'jwt_token';
  private loggedin = new BehaviorSubject<boolean>(this.hasToken());
  private currentUserSubject: BehaviorSubject<any | null>;
  private jwtHelper: JwtHelperService;

  constructor(private http: HttpClient, private router: Router) {


    const token = this.getToken();
    const user = token ? this.decodeToken(token) : null;
    this.currentUserSubject = new BehaviorSubject<any | null>(user);
    this.jwtHelper = new JwtHelperService();
  }


  isLoggedIn(): Observable<boolean> {
    return this.loggedin.asObservable();
  }

  hasToken(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentUser(): Observable<any | null> {
    return this.currentUserSubject.asObservable();
  }

  private decodeToken(token: string): any | null {
    try {
      return this.jwtHelper.decodeToken(token);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }


  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        localStorage.setItem(this.tokenKey, response.access_token);
        this.loggedin.next(true);
      }),
      catchError(error => {
        console.error('Login failed:', error);
        throw error;
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

  logout(): void {
    localStorage.removeItem(this.tokenKey); // Remove o token
    this.loggedin.next(false); // Atualiza o status de login
    this.currentUserSubject.next(null); // Limpa as informações do usuário
    this.router.navigate(['/login']); // Redireciona para a página de login
  }





}
