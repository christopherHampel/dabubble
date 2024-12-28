import { inject, Injectable, signal } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile, user } from '@angular/fire/auth';
import { UserRegister } from '../../interfaces/userRegister';
import { from, Observable } from 'rxjs';
import { sendPasswordResetEmail } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  user$ = user(this.auth);
  currentUserSig = signal<UserRegister | null | undefined>(undefined);
  currentUserExample: [{name:string, uid:string, email:string}] = [
    {
      name: 'Christopher Hampel',
      uid: '123456789',
      email: 'christopher.hampel@yahoo.de',
    }
  ];

  constructor() { }

  register(userName: string, email: string, password: string, avatar: string): Observable<string> {
    const promise = createUserWithEmailAndPassword(this.auth, email, password)
      .then((response) => {
        updateProfile(response.user, {
          displayName: userName,
          photoURL: avatar
        })
        return response.user.uid;
      });

    return from(promise);
  }

  login(email: string, password: string): Observable<string> {
    const promise = signInWithEmailAndPassword(this.auth, email, password)
      .then((response) => {
        return response.user.uid;
      });

    return from(promise);
  }

  loginWithGoogle(): Observable<string> {
    const provider = new GoogleAuthProvider();
    const promise = signInWithPopup(this.auth, provider)
      .then((response) => { 
        return response.user.uid;
      });

    return from(promise);
  }

  resetPassword(email: string): Observable<void> {
    const promise = sendPasswordResetEmail(this.auth, email);
    return from(promise);
  }

  logout(): Observable<void> {
    const promise = signOut(this.auth);
    return from(promise);
  }

}
