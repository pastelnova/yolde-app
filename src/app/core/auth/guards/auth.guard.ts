import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { CanActivateFn, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return toObservable(authService.getCurrentUserResource.status).pipe(
    filter(status => status !== 'loading'),
    map(() => {
      const user = authService.getCurrentUserResource.value()?.user;

      if (!user) {
        return router.createUrlTree(['/signin']);
      }

      return true;
    })
  );
};
