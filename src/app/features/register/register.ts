import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../core/auth/services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthFormInterface } from '../../core/auth/models/auth-form.interface';
import { Router, RouterModule } from '@angular/router';
import { ErrorService } from '../../shared/services/error.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  authService = inject(AuthService);
  errorService = inject(ErrorService);
  authForm: FormGroup<AuthFormInterface>;
  router = inject(Router);

  constructor() {
    this.authForm = new FormGroup<AuthFormInterface>({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
        nonNullable: true,
      }),
      password: new FormControl('', {
        validators: [Validators.required, Validators.minLength(8)],
        nonNullable: true,
      }),
      username: new FormControl('', {
        validators: [Validators.required, Validators.minLength(3)],
        nonNullable: true,
      }),
    });
  }

  showPassword = false;
  serverError = signal('');

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    this.serverError.set('');
    this.authService
      .register({
        username: this.authForm.value.username!,
        email: this.authForm.value.email!,
        password: this.authForm.value.password!,
      })
      .subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.serverError.set(this.errorService.extractMessage(error, 'Registration failed. Please try again.'));
        },
      });
  }
}
