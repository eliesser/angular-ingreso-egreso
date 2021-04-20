import { Injectable } from '@angular/core';
import { CanLoad } from '@angular/router';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AutGuard implements CanLoad {
  constructor(private authService: AuthService) {}

  canLoad(): Observable<boolean> {
    return this.authService.isAuth().pipe(take(1));
  }
}
