import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { AppState } from '../app.reducer';

import { IngresoEgreso } from './ingreso-egreso.model';

import { AuthService } from '../auth/auth.service';

import * as fromIngresoEgreso from './ingreso-egreso.actions';
import { UnsetUserAction } from '../auth/auth.actions';

@Injectable({
  providedIn: 'root',
})
export class IngresoEgresoService {
  subscriptionIE: Subscription = new Subscription();
  subscriptionIEItems: Subscription = new Subscription();

  constructor(
    private afDB: AngularFirestore,
    private authService: AuthService,
    private store: Store<AppState>
  ) {}

  initIngresoEgresoListener() {
    this.subscriptionIE = this.store
      .select('auth')
      .pipe(filter((auth) => auth.user != null))
      .subscribe((auth) => {
        this.ingresoEgresoItems(auth.user.uid);
      });
  }

  private ingresoEgresoItems(uid: string) {
    this.subscriptionIEItems = this.afDB
      .collection(`${uid}/ingresos-egresos/items/`)
      .snapshotChanges()
      .pipe(
        map((docData) => {
          return docData.map((doc: any) => {
            return {
              uid: doc.payload.doc.id,
              ...doc.payload.doc.data(),
            };
          });
        })
      )
      .subscribe((coleccion: any) => {
        this.store.dispatch(new fromIngresoEgreso.setItemsAction(coleccion));
      });
  }

  crearIngresoEgreso(ingresoEgreso: IngresoEgreso) {
    const user = this.authService.getUser();
    return this.afDB
      .doc(`${user.uid}/ingresos-egresos`)
      .collection('items')
      .add({ ...ingresoEgreso });
  }

  borrarIngresoEgreso(uid: string) {
    const user = this.authService.getUser();
    return this.afDB.doc(`${user.uid}/ingresos-egresos/items/${uid}`).delete();
  }

  cancelarSubscricions() {
    this.subscriptionIE.unsubscribe();
    this.subscriptionIEItems.unsubscribe();
    this.store.dispatch(new fromIngresoEgreso.unsetItemsAction());
  }
}
