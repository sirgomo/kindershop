import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CanActivateFn } from '@angular/router';

export const routeGuard: CanActivateFn = (route, state) => {
  const snack = inject(MatSnackBar);
  if(localStorage.getItem('role') === 'admin')
    return true;

  snack.open('Unmöglich!', 'Ok', { duration: 3000 })
  return false;
};
