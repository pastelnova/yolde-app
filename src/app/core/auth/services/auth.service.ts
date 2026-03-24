import { HttpClient, httpResource } from '@angular/common/http';
import { computed, effect, inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { UserInterface } from '../models/user.interface';
import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { authStore } from '../store/auth.store';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private tokenService = inject(TokenService);
  private router = inject(Router);
  private store = inject(authStore);

  private user = computed(() => this.getCurrentUserResource.value()?.user);

  constructor() {
    effect(() => {
      const status = this.getCurrentUserResource.status();
      if (status === 'loading') {
        return;
      }

      if (status === 'error') {
        console.log('Failed to fetch user data');

        this.signout();
        return null;
      }

      const user = this.user();
      if (!user) {
        return;
      }
      this.tokenService.set(user.token);
      this.store.signIn(user);
      return user;
    });
  }

  // get resources
  getCurrentUserResource = httpResource<{ user: UserInterface }>(() =>
    this.tokenService.token() ? `/user` : undefined,
  );

  register(user: { username: string; email: string; password: string }): Observable<{ user: UserInterface }> {
    return this.http.post<{ user: UserInterface }>('/users', { user }).pipe(
      tap(({ user }) => {
        this.tokenService.set(user.token);
        this.store.signIn(user);
      }),
    );
  }

  signin(user: { email: string; password: string }): Observable<{ user: UserInterface }> {
    return this.http.post<{ user: UserInterface }>('/users/login', { user }).pipe(
      tap(({ user }) => {
        this.tokenService.set(user.token);
        this.store.signIn(user);
      }),
    );
  }

  updateUser(user: Partial<Omit<UserInterface, 'token'>>): Observable<{ user: UserInterface }> {
    return this.http.put<{ user: UserInterface }>('/user', { user }).pipe(
      tap(({ user }) => {
        this.store.signIn(user);
      }),
    );
  }

  signout() {
    this.tokenService.remove();
    this.store.signout();
    this.router.navigate(['/signin']);
  }
}
