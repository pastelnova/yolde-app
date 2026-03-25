import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthFormInterface } from '../../core/auth/models/auth-form.interface';
import { AuthService } from '../../core/auth/services/auth.service';
import { Router, RouterModule } from '@angular/router';
import { ErrorService } from '../../shared/services/error.service';

@Component({
  selector: 'app-signin',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './signin.html',
  styleUrl: './signin.scss',
})
export class Signin {
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
        validators: [Validators.required],
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
      .signin({
        email: this.authForm.value.email!,
        password: this.authForm.value.password!,
      })
      .subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          this.serverError.set(this.errorService.extractMessage(error, 'Sign in failed. Please try again.'));
        },
      });
  }
}
