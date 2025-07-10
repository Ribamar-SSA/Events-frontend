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
  private jwtHelper: JwtHelperService;
  private loggedIn: BehaviorSubject<boolean>;
  private currentUserSubject: BehaviorSubject<any | null>;


  constructor(private http: HttpClient, private router: Router) {

    this.jwtHelper = new JwtHelperService();
    this.loggedIn = new BehaviorSubject<boolean>(this.hasToken());
    const token = this.getToken();
    const user = token ? this.decodeToken(token) : null;
    this.currentUserSubject = new BehaviorSubject<any | null>(user);
    
  }


  isloggedIn(): Observable<boolean> {
    return this.loggedIn.asObservable();
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
        if (response && response.data && response.data.token) {
          this.setSession(response.data.token);
        } else {
          console.error('Login: Token não encontrado na resposta da API.', response);
          throw new Error('Token não recebido após o login.');
        }
      }),
      catchError(error => {
        console.error('Login failed:', error);
        throw error;
      })
    );
  }

  private setSession(token: string): void {
    localStorage.setItem(this.tokenKey, token);
    this.loggedIn.next(true);
    const user = (token && typeof token === 'string' && token.length > 0 && token.split('.').length === 3) ? this.decodeToken(token) : null;
    this.currentUserSubject.next(user);
  }


  register(userData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, userData).pipe(
      tap(response => {
        if (response && response.data && response.data.token) {
          this.setSession(response.data.token);
        } else {
          console.warn('Registro bem-sucedido, mas nenhum token foi retornado. O usuário precisará fazer login manualmente.', response);


          this.router.navigate(['/login']);
        }
      }),
      catchError(error => {
        console.error('Registration failed:', error);
        throw error;
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.loggedIn.next(false);
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
  }





}
