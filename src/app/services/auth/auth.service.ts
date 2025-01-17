import { inject, Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import { Auth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile, user } from '@angular/fire/auth';
import { sendPasswordResetEmail } from 'firebase/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private firebaseapp = inject(FirebaseApp);
  private auth = inject(Auth);
  currentAuthUser = user(this.auth);
  // currentUserExample: [{ name: string, uid: string, email: string }] = [
  //   {
  //     name: 'Christopher Hampel',
  //     uid: '123456789',
  //     email: 'christopher.hampel@yahoo.de',
  //   }
  // ];

  constructor() { }


  async register(userName: string, email: string, password: string, avatar: string) {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);

    await updateProfile(userCredential.user, {
      displayName: userName,
      photoURL: avatar
    })

    return userCredential.user.uid;
  }


  async login(email: string, password: string) {
    await signInWithEmailAndPassword(this.auth, email, password);
  }


  async loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(this.auth, provider);
  }


  async resetPassword(email: string) {
    await sendPasswordResetEmail(this.auth, email);
  }


  async logout() {
    await signOut(this.auth);
  }
}
