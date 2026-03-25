import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  extractMessage(error: unknown, fallback: string): string {
    const errors = (error as { error?: { errors?: Record<string, string | string[]> } })?.error?.errors;
    if (errors) {
      return Object.entries(errors)
        .map(([field, msgs]) => `${field} ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
        .join('. ');
    }
    return fallback;
  }
}
