import { inject, Injectable } from '@angular/core';
import { setDoc, collection, Firestore, doc, writeBatch, getDoc } from '@angular/fire/firestore';
import { UserProfile } from '../../interfaces/userProfile';

@Injectable({
  providedIn: 'root'
})
export class FireDbService {
  fireDb = inject(Firestore)
  currentUId: string = '';

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
      this.currentUId = user.id;
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

  async getUser(userRef: any) {
    const userDoc = await getDoc(userRef);
    console.log('Get userdoc: ', userDoc)
  }

  getUserRef() {
    return collection(this.fireDb, 'users');
  }
}
