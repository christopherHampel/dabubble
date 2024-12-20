import { inject, Injectable, signal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signOut, user } from '@angular/fire/auth';
import { signInWithEmailAndPassword } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);
  private _userSignal = signal<any | null>(null);

  constructor() {
    user(this.auth).subscribe((currentUser) => {
      this._userSignal.set(currentUser);
    });
  }

  get userSignal() {
    return this._userSignal();
  }

  async register(email: string, password: string) {
    return createUserWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        this._userSignal.set(userCredential);
        console.info('Registriert: ', userCredential.user.email);
      })
      .catch((error) => {
        console.log('Fehler bei der Registrierung: ', error);
      });
  }

  async login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        this._userSignal.set(userCredential.user);
        console.info('Login: ', userCredential.user.email);
      })
      .catch((error) => {
        console.log('Fehler bei der Anmeldung: ', error);
      });
  }

  async logout() {
    return signOut(this.auth)
      .then(() => {
        this._userSignal.set(null)
        console.log('Logout!');
      })
      .catch((error) => {
        console.log('Fehler beim ausloggen: ', error);
      });
  }

}
