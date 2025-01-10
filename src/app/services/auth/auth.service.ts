import { inject, Injectable, Injector, NgZone, runInInjectionContext, signal } from '@angular/core';
import { Auth, User, createUserWithEmailAndPassword, getAuth, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile, user } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';
import { sendPasswordResetEmail } from 'firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth;
  private ngZone = inject(NgZone);
  private injector = inject(Injector);
  private authStateSignal = signal<User | null>(null);
  currentAuthUser;
  currentUserExample: [{ name: string, uid: string, email: string }] = [
    {
      name: 'Christopher Hampel',
      uid: '123456789',
      email: 'christopher.hampel@yahoo.de',
    }
  ];

  constructor(private authInstance: Auth) {
    this.auth = this.authInstance;
    this.currentAuthUser = user(this.auth);
    this.auth.onAuthStateChanged((user) => {
      this.authStateSignal.set(user);
    })
  }

  get currentUser$(): Observable<User | null> {
    return from(new Promise<User | null>((resolve) => {
      resolve(this.auth.currentUser);
    }));
  }

  get userSignal() {
    return this.authStateSignal.asReadonly();
  }

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

  async login(email: string, password: string): Promise<void> {
      console.log('Crazy login');
      console.log('First Zone: ', Zone.current.name);
      return runInInjectionContext(this.injector, () => {
      signInWithEmailAndPassword(this.auth, email, password)
        .then((response) => response.user)
      })
  }

  //loginWithGoogle(): Observable<void> {
  //  const provider = new GoogleAuthProvider();
  //  const promise = signInWithPopup(this.auth, provider)
  //    .then(() => {
  //    });

  //  return from(promise);
  //}

  resetPassword(email: string) {
    const promise = sendPasswordResetEmail(this.auth, email);
  }

  logout() {
    signOut(this.auth)
  }
}
