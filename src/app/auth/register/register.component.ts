import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';
import { AppState } from '../../app.reducer';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: [],
})
export class RegisterComponent implements OnInit, OnDestroy {
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

  createUser(data: any) {
    this.authService.createUser(data.nombre, data.email, data.password);
  }
}
