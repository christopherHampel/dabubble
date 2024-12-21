import { inject, Injectable, signal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile, user } from '@angular/fire/auth';
import { UserInterface } from '../../interfaces/userInterface';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  user$ = user(this.auth);
  currentUserSig = signal<UserInterface | null | undefined>(undefined);

  constructor() { }

  register(userName: string, email: string, password: string): Observable<void> {
    const promise = createUserWithEmailAndPassword(this.auth, email, password)
    .then((response) => {
      updateProfile(response.user, { displayName: userName });
    })

    return from(promise);
  }

  login(email: string, password: string): Observable<void> {
    const promise = signInWithEmailAndPassword(this.auth, email, password)
    .then(() => {});

    return from(promise);
  }

  loginWithGoogle(): Observable<void> {
    const provider = new GoogleAuthProvider();
    const promise = signInWithPopup(this.auth, provider)
    .then(() => {});

    return from(promise);
  }

  logout(): Observable<void> {
    const promise = signOut(this.auth);
    return from(promise);
  }

}
