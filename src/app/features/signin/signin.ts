import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthFormInterface } from '../../core/auth/models/auth-form.interface';
import { AuthService } from '../../core/auth/services/auth.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-signin',
  imports: [ReactiveFormsModule, RouterModule],
  templateUrl: './signin.html',
  styleUrl: './signin.scss',
})
export class Signin {
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
        validators: [Validators.required],
        nonNullable: true,
      }),
    });
  }

  onSubmit() {
    this.authService
      .signin({
        email: this.authForm.value.email!,
        password: this.authForm.value.password!,
      })
      .subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: error => {
          console.log('Signin failed:', error);
        },
      });
  }
}
