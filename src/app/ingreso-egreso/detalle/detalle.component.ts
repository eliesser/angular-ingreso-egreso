import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { AppStateE } from '../ingreso-egreso.reducer';

import Swal from 'sweetalert2';

import { IngresoEgreso } from '../ingreso-egreso.model';
import { IngresoEgresoService } from '../ingreso-egreso.service';
@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styles: [],
})
export class DetalleComponent implements OnInit, OnDestroy {
  subscription: Subscription = new Subscription();
  items: IngresoEgreso[] = [];

  constructor(
    private store: Store<AppStateE>,
    private ingresoEgresoService: IngresoEgresoService
  ) {}

  ngOnInit(): void {
    this.subscription = this.store
      .select('ingresoEgreso')
      .subscribe((ingresoEgreso) => {
        this.items = ingresoEgreso.items;
      });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  borar(item: IngresoEgreso) {
    this.ingresoEgresoService
      .borrarIngresoEgreso(item.uid)
      .then(() => {
        Swal.fire('Detalle eliminado', item.descripcion, 'success');
      })
      .catch();
  }
}
