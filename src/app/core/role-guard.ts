import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from './auth';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const roles = route.data['roles'] as string[];
  const user = authService.currentUser();

  if (user && roles.includes(user.role)) return true;
  return inject(Router).createUrlTree(['/login']);

};
