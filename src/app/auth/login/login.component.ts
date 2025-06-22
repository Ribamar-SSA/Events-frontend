import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importe CommonModule para *ngIf
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms'; // Importe ReactiveFormsModule e classes de formulário
import { AuthService } from '../auth.service'; // Ajuste o caminho se necessário
import { Router } from '@angular/router'; // Para redirecionar após o login

@Component({
  selector: 'app-login',
  // IMPORTANTE: Adicione os módulos necessários aqui para Standalone Components
  imports: [
    CommonModule, // Necessário para diretivas como *ngIf
    ReactiveFormsModule // Necessário para formulários reativos
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder, // Injeta FormBuilder
    private authService: AuthService, // Injeta AuthService
    private router: Router // Injeta Router
  ) {
    // Inicializa o formulário no construtor
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigate(['/dashboard']); // Redireciona para uma página protegida
        },
        error: (err) => {
          this.errorMessage = 'Credenciais inválidas. Por favor, tente novamente.';
          console.error('Login error:', err);
          // Você pode adicionar mais lógica de erro aqui, como verificar o status HTTP do erro
        }
      });
    } else {
      this.errorMessage = 'Por favor, preencha todos os campos corretamente.';
      // Opcional: Marcar todos os campos como 'touched' para exibir mensagens de validação
      this.loginForm.markAllAsTouched();
    }
  }
}
