import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8000';
  isAuthenticated = signal(false);

  constructor(private http: HttpClient, private router: Router) { }


  getCsrfCookie(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sanctum/csrf-cookie`, { withCredentials: true })
      .pipe(
        catchError(error => {
          console.error('Erro ao obter CSRF cookie:', error);
          return throwError(() => new Error('Não foi possível obter o token CSRF.'));
        })
      );
  }


  login(credentials: { email: string, password: string }): Observable<any> {
    return this.getCsrfCookie().pipe(
      tap(() => console.log('CSRF cookie obtido. Tentando login...')),
      catchError(error => {
        return throwError(() => error);
      }),

      () => this.http.post(`${this.apiUrl}/login`, credentials, { withCredentials: true }).pipe(
        tap((response: any) => {
          this.isAuthenticated.set(true);
          console.log('Login bem-sucedido!', response);
        }),
        catchError(error => {
          this.isAuthenticated.set(false);
          console.error('Erro no login:', error);
          let errorMessage = 'Ocorreu um erro ao tentar fazer login.';
          if (error.status === 422 && error.error && error.error.errors) {
            // Laravel Validation Errors
            errorMessage = Object.values(error.error.errors).flat().join(' ');
          } else if (error.status === 401 || error.status === 419) {
            // Unauthorized (credenciais inválidas) ou CSRF token mismatch
            errorMessage = 'Credenciais inválidas ou sessão expirada. Tente novamente.';
          } else if (error.statusText) {
            errorMessage = `Erro de conexão: ${error.statusText}`;
          }
          return throwError(() => new Error(errorMessage));
        })
      )
    );
  }


  logout(): Observable<any> {

    return this.getCsrfCookie().pipe(
      tap(() => console.log('CSRF cookie obtido para logout. Tentando logout...')),
      catchError(error => {
        return throwError(() => error); // Propaga o erro se o CSRF falhar
      }),
      () => this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).pipe(
        tap(() => {
          this.isAuthenticated.set(false);
          console.log('Logout bem-sucedido!');
          this.router.navigate(['/login']); // Redireciona para a página de login após o logout
        }),
        catchError(error => {
          console.error('Erro no logout:', error);
          return throwError(() => new Error('Ocorreu um erro ao tentar fazer logout.'));
        })
      )
    );
  }

  checkAuthStatus(): void {
    this.http.get(`${this.apiUrl}/api/user`, { withCredentials: true }).pipe(
      catchError(error => {
        this.isAuthenticated.set(false);
        return throwError(() => error);
      })
    ).subscribe({
      next: () => {
        this.isAuthenticated.set(true);
        console.log('Usuário já autenticado.');
      },
      error: () => {
        this.isAuthenticated.set(false);
        console.log('Usuário não autenticado.');
      }
    });
  }

}
