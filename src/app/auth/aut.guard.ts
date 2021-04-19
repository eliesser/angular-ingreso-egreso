import { Injectable } from '@angular/core';

import { CanActivate, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AutGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.authService.isAuth();
  }
}
