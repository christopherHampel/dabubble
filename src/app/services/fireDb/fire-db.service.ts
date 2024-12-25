import { inject, Injectable } from '@angular/core';
import { setDoc, collection, Firestore, doc, writeBatch, getDoc } from '@angular/fire/firestore';
import { UserProfile } from '../../interfaces/userProfile';
import { onSnapshot } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class FireDbService {
  fireDb = inject(Firestore)
  currentUser: UserProfile | null = null;

  constructor() { }

  getCleanJson(user: UserProfile): {} {
    return {
      id: user.id,
      userName: user.userName,
      email: user.email,
      avatar: user.avatar,
      active: user.active
    }
  }

  async addUser(user: any) {
    try {
      const userRef = doc(this.getUserRef(), user.id);
      await setDoc(userRef, user);
      this.subScribeToUser(user.id);
      console.log('User addes successfully with ID: ', user.id);
    } catch (err) {
      console.log('Error during add user: ', err);
    }
  }

  async addSubcollecionsToUser(userRef: any) {
    const batch = writeBatch(this.fireDb);
    const channelsRef = doc(collection(userRef, 'channels'));
    const friendsRef = doc(collection(userRef, 'friends'));
    const profileRef = doc(collection(userRef, 'profile'));

    batch.set(channelsRef, {});
    batch.set(friendsRef, {});
    batch.set(profileRef, {});

    await batch.commit();
  }

  getUserRef() {
    return collection(this.fireDb, 'users');
  }

  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.fireDb, colId), docId);
  }

  subScribeToUser(id: string) {
    onSnapshot(this.getSingleDocRef('users', id), (doc) => {
      if (doc.exists()) {
        this.currentUser = doc.data() as UserProfile;
        console.log(this.currentUser);
      } else {
        console.log('User does not exist!');
        this.currentUser = null;
      }
    });
  }
}
