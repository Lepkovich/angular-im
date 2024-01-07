import { CanActivateFn } from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "./auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";

export const authGuard: CanActivateFn = (route, state) => {

  const authService = inject(AuthService) as AuthService;
  const _snackBar = inject(MatSnackBar) as MatSnackBar;
  const isLoggedIn = authService.isLoggedIn();

  if (!isLoggedIn) {
    _snackBar.open('Для доступа необходимо авторизоваться')
  }

  return isLoggedIn;
};
