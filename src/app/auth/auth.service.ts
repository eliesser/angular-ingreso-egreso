import { Injectable } from '@angular/core';

/* import { AngularFireAuth } from '@angular/fire/auth'; */

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(/* public afAuth: AngularFireAuth */) {}

  crearUsuario(nombre: string, email: string, password: string) {
    /* this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then((resp) => {
        console.error(resp);
      })
      .catch((error) => {
        console.error(error);
      }); */
  }
}
