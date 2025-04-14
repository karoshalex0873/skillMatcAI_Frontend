import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { catchError, map, of } from 'rxjs';


export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService)
  const router = inject(Router);

  return authService.verifyAuth().pipe(
    map(() => true),
    catchError(() => {
      setTimeout(() => {
        router.navigate(['/login']);
      }, 1500);
      return of(false);
    })
  )
};
