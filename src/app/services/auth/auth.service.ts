import { inject, Injectable, signal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signOut, user } from '@angular/fire/auth';
import { signInWithEmailAndPassword } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  auth = inject(Auth);
  userSignal = signal<any | null>(null);
  userCredential: any = null;

  constructor() { 
    user(this.auth).subscribe((currentUser) => {
      this.userSignal.set(currentUser);
    });
  }

  async register(email: string, password: string) {
    return await createUserWithEmailAndPassword(this.auth, email, password)
    .then((userCredential) => {
      this.userSignal.set(userCredential);
      this.userCredential = userCredential;
    })
    .catch((error) => {
      console.log('Fehler bei der Registrierung: ', error);
    });
  }

  async login(email: string, password: string) {
    return await signInWithEmailAndPassword(this.auth, email, password)
    .then((userCredential) => {
      this.userSignal.set(userCredential.user);
      this.userCredential = userCredential;
    })
    .catch((error) => {
      console.log('Fehler bei der Anmeldung: ', error);
    });
  }

  async logout() {
    return await signOut(this.auth)
    .then(() => {
      this.userSignal.set(null)
      console.log(this.userCredential.user.email);
    })
    .catch((error) => {
      console.log('Fehler beim ausloggen: ', error);
    })
  }

}
