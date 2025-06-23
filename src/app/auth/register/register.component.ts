import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

const passwordMatchValidator: ValidatorFn = (control: AbstractControl): { [key: string]: boolean } | null => {
  const password = control.get('password');
  const passwordConfirmation = control.get('password_confirmation');

  if (!password || !passwordConfirmation) {
    return null;
  }

  return password.value === passwordConfirmation.value ? null : { passwordsMismatch: true };
};

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', Validators.required]
    }, { validators: passwordMatchValidator });
  }

  onSubmit(): void {
    this.errorMessage = '';

    if (this.registerForm.valid) {
      const userData = {
        name: this.registerForm.value.name,
        email: this.registerForm.value.email,
        password: this.registerForm.value.password,
        password_confirmation: this.registerForm.value.password_confirmation
      };

      this.authService.register(userData).subscribe({
        next: () => {
          this.router.navigate(['/events']);
        },
        error: (err) => {
          console.error('Registration error:', err);
          if (err.error && err.error.message) {
            this.errorMessage = err.error.message;
          } else if (err.status === 422 && err.error.errors) {
            let validationErrors = '';
            for (const key in err.error.errors) {
              if (err.error.errors.hasOwnProperty(key)) {
                validationErrors += `${err.error.errors[key].join(', ')}\n`;
              }
            }
            this.errorMessage = `Erro de validação: ${validationErrors}`;
          } else {
            this.errorMessage = 'Erro ao registrar. Por favor, tente novamente mais tarde.';
          }
        }
      });
    } else {
      this.errorMessage = 'Por favor, preencha todos os campos corretamente.';
      this.registerForm.markAllAsTouched();
    }
  }
}
