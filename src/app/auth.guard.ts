import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { inject } from '@angular/core';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuth() == false) {
      router.navigate(['/login']);
      return false;
  }

  return authService.isAuth();
};