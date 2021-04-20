import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';

import { AppStateE } from '../ingreso-egreso.reducer';

import { IngresoEgreso } from '../ingreso-egreso.model';

@Component({
  selector: 'app-estadistica',
  templateUrl: './estadistica.component.html',
  styles: [],
})
export class EstadisticaComponent implements OnInit {
  subscription: Subscription = new Subscription();

  ingresos: number;
  egresos: number;

  cuantosIngresos: number;
  cuantosEgresos: number;

  doughnutChartLabels: string[] = ['Ingresos', 'Egresos'];

  doughnutChartData: number[] = [];

  constructor(private store: Store<AppStateE>) {}

  ngOnInit(): void {
    this.subscription = this.store
      .select('ingresoEgreso')
      .subscribe((ingresoEgreso) => {
        this.contarIngresoEgreso(ingresoEgreso.items);
      });
  }

  contarIngresoEgreso(items: IngresoEgreso[]) {
    this.ingresos = 0;
    this.egresos = 0;
    this.cuantosEgresos = 0;
    this.cuantosIngresos = 0;

    items.forEach((item) => {
      if (item.tipo === 'ingreso') {
        this.cuantosIngresos++;
        this.ingresos += item.monto;
      } else {
        this.cuantosEgresos++;
        this.egresos += item.monto;
      }
    });

    this.doughnutChartData = [this.ingresos, this.egresos];
  }
}
