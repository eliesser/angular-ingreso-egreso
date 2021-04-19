import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';
import { Subscription } from 'rxjs';

import firebase from 'firebase';
import Swal from 'sweetalert2';

import { User } from './user.model';
import { AppState } from '../app.reducer';

import * as fromUI from '../shared/ui.actions';
import { SetUserAction } from './auth.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  subscriotion: Subscription = new Subscription();

  constructor(
    public afAuth: AngularFireAuth,
    private router: Router,
    private afDB: AngularFirestore,
    private store: Store<AppState>
  ) {}

  initAutListener() {
    this.subscriotion = this.afAuth.authState.subscribe(
      (fbUser: firebase.User) => {
        if (fbUser) {
          this.afDB
            .doc(`${fbUser.uid}/usuario`)
            .valueChanges()
            .subscribe((usuarioObj: any) => {
              const newUser = new User(usuarioObj);
              this.store.dispatch(new SetUserAction(newUser));
            });
        } else {
          this.subscriotion.unsubscribe();
        }
      }
    );
  }

  createUser(nombre: string, email: string, password: string) {
    this.store.dispatch(new fromUI.ActivarLoadingAction());

    this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then((resp) => {
        const user: User = {
          uid: resp.user.uid,
          nombre,
          email: resp.user.email,
        };

        this.afDB
          .doc(`${user.uid}/usuario`)
          .set(user)
          .then(() => {
            this.store.dispatch(new fromUI.DesactivarLoadingAction());

            this.router.navigate(['/']);
          });
      })
      .catch((error) => {
        this.store.dispatch(new fromUI.DesactivarLoadingAction());
        Swal.fire('Error en el registro', error.message, 'error');
      });
  }

  login(email: string, password: string) {
    this.store.dispatch(new fromUI.ActivarLoadingAction());

    this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then((resp) => {
        this.store.dispatch(new fromUI.DesactivarLoadingAction());
        this.router.navigate(['/']);
      })
      .catch((error) => {
        this.store.dispatch(new fromUI.DesactivarLoadingAction());
        Swal.fire('Error en el login', error.message, 'error');
      });
  }

  loguot() {
    this.afAuth.signOut();
    this.router.navigate(['/login']);
  }

  isAuth() {
    return this.afAuth.authState.pipe(
      map((fbUser) => {
        if (fbUser === null) {
          this.router.navigate(['/login']);
        }
        return fbUser != null;
      })
    );
  }
}
