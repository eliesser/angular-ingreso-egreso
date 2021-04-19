import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { AppState } from 'src/app/app.reducer';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [],
})
export class LoginComponent implements OnInit, OnDestroy {
  cargando: boolean;
  subscriotion: Subscription;

  constructor(
    private authService: AuthService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.subscriotion = this.store
      .select('ui')
      .subscribe((ui) => (this.cargando = ui.isLoading));
  }

  ngOnDestroy() {
    this.subscriotion.unsubscribe();
  }

  login(data: any) {
    this.authService.login(data.email, data.password);
  }
}
