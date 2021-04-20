import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngrx/store';

import Swal from 'sweetalert2';

import { IngresoEgreso } from './ingreso-egreso.model';
import { IngresoEgresoService } from './ingreso-egreso.service';
import { AppState } from '../app.reducer';
import { Subscription } from 'rxjs';

import * as fromUI from '../shared/ui.actions';
import * as fromIngresoEgreso from './ingreso-egreso.actions';

@Component({
  selector: 'app-ingreso-egreso',
  templateUrl: './ingreso-egreso.component.html',
  styles: [],
})
export class IngresoEgresoComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();

  cargando: boolean = false;

  form: FormGroup;
  tipo = 'ingreso';

  constructor(
    private ingresoEgresoService: IngresoEgresoService,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.subscription = this.store
      .select('ui')
      .subscribe((ui) => (this.cargando = ui.isLoading));

    this.form = new FormGroup({
      descripcion: new FormControl('', Validators.required),
      monto: new FormControl(0, Validators.min(1)),
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  cargarIngresoEgreso() {
    const ingresoEgreso: IngresoEgreso = new IngresoEgreso({
      ...this.form.value,
      tipo: this.tipo,
    });

    this.store.dispatch(new fromUI.ActivarLoadingAction());

    this.ingresoEgresoService
      .crearIngresoEgreso(ingresoEgreso)
      .then((resp) => {
        this.store.dispatch(new fromUI.DesactivarLoadingAction());

        this.form.reset({
          monto: 0,
        });

        Swal.fire('Creado', ingresoEgreso.descripcion, 'success');
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
