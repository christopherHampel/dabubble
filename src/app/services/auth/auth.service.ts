import { inject, Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile, user } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';
import { sendPasswordResetEmail } from 'firebase/auth';
import { UsersDbService } from '../usersDb/users-db.service';
import { setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private usersDb = inject(UsersDbService);
  user$ = user(this.auth);
  currentUserExample: [{ name: string, uid: string, email: string }] = [
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
        const userId = response.user.uid;
        this.updateUserStatus(userId, true);
        return userId;
      });

    return from(promise);
  }

  loginWithGoogle(): Observable<string> {
    const provider = new GoogleAuthProvider();
    const promise = signInWithPopup(this.auth, provider)
      .then((response) => {
        const userId = response.user.uid;
        this.updateUserStatus(userId, true);
        return userId;
      });

    return from(promise);
  }

  resetPassword(email: string): Observable<void> {
    const promise = sendPasswordResetEmail(this.auth, email);
    return from(promise);
  }

  logout(): Observable<void> {
    this.user$.subscribe((user) => {
      console.log(user?.uid);
      const userId = user!.uid;
      this.updateUserStatus(userId, false);
    })
    const promise = signOut(this.auth)
      .then(() => { })
    return from(promise);
  }

  private updateUserStatus(userId: string, active: boolean) {
    const userRef = this.usersDb.getSingleDocRef('users', userId);
    setDoc(userRef, { active: active }, { merge: true });
    console.log(userRef.firestore);
  }
}
