import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../../components/auth/login/login.service';


export const authGuard: CanActivateFn = (route, state) => {
  const authService: LoginService = inject(LoginService);
  const router: Router = inject(Router);
  if (!authService.isLoggedIn()) {
    router.navigate(['/']);
    return false;
  }

  return true;
};