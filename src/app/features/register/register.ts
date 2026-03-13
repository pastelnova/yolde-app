import { Component, inject } from '@angular/core';
import { AuthService } from '../../core/auth/services/auth.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthFormInterface } from '../../core/auth/models/auth-form.interface';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  authService = inject(AuthService);
  authForm: FormGroup<AuthFormInterface>;
  router = inject(Router);

  constructor() {
    this.authForm = new FormGroup<AuthFormInterface>({
      email: new FormControl('', {
        validators: [Validators.required, Validators.email],
        nonNullable: true,
      }),
      password: new FormControl('', {
        validators: [Validators.required, Validators.minLength(3)], //TODO: maybe 8
        nonNullable: true,
      }),
      username: new FormControl('', {
        validators: [Validators.required, Validators.minLength(3)],
        nonNullable: true,
      }),
    });
  }

  onSubmit() {
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
          console.error('Registration failed:', error);
        },
      });
  }
}
