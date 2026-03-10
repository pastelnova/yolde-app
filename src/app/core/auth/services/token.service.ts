import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly key = 'token';

  readonly token = signal<string | null>(this.getFromStorage());

  private getFromStorage(): string | null {
    return localStorage.getItem(this.key);
  }

  set(token: string): void {
    localStorage.setItem(this.key, token);
    this.token.set(token);
  }

  remove(): void {
    localStorage.removeItem(this.key);
    this.token.set(null);
  }

  getValidToken(): string | null {
    const token = this.token();
    if (!token) return null;
    return this.isTokenExpired(token) ? null : token;
  }

  isTokenExpired(token: string): boolean {
    try {
      const expirationDate = this.getExpirationDate(token);
      if (!expirationDate) return true;
      return Date.now() > expirationDate.getTime();
    } catch {
      return true;
    }
  }

  getExpirationDate(token: string): Date | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);
      const payload = JSON.parse(atob(padded));
      const expiration = payload.exp;
      if (typeof expiration !== 'number') return null;
      return new Date(expiration * 1000);
    } catch {
      return null;
    }
  }

  getRemainingTimeValidity(token: string): number {
    const expirationDate = this.getExpirationDate(token);
    if (!expirationDate) return 0;
    return Math.max(0, expirationDate.getTime() - Date.now());
  }
}
