import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authSercive = inject(AuthService);

  return authSercive.currentUser.pipe(
    take(1),
    map(user => {
      if(user) {
        return true;
      }

      router.navigate(['/login']);
      return false;
    })
  )
};

export const publicGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const authSercive = inject(AuthService);

  return authSercive.currentUser.pipe(
    take(1),
    map(user => {
      if(!user) {
        return true;
      }

      router.navigate(['/home']);
      return false;
    })
  )
};