import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { map, catchError, of } from 'rxjs';

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const authGuard = inject(AuthService);
    const router = inject(Router);
    const user = authGuard.getUser()

    // check from memory
    if (user && allowedRoles.includes(user.Role.toString())) {
      return true
    }

    // 
    return authGuard.verifyAuth().pipe(
      map(res => {
        if (res && allowedRoles.includes(res.Rol.toString())) {
          authGuard.setUser(res)
          return true
        } else {
          router.navigate(['/home']);
          return false;
        }
      }),
      catchError(() => {
        setTimeout(() => {
          router.navigate(['/login']);
        }, 1500);
        return of(false);
      })
    );
  };
};
