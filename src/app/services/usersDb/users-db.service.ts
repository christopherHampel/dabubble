import { inject, Injectable, signal } from '@angular/core';
import { collection, doc, Firestore, onSnapshot, setDoc } from '@angular/fire/firestore';
import { UserProfile } from '../../interfaces/userProfile';

@Injectable({
  providedIn: 'root'
})
export class UsersDbService {
  usersDb = inject(Firestore)
  currentUserSig = signal<UserProfile | null>(null);

  userListSig = signal<UserProfile[]>([]);
  unsubUserList;

  constructor() { 
    this.unsubUserList = this.subUserList();
  }

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
      console.log('User addes successfully with ID: ', user.id);
    } catch (err) {
      console.log('Error during add user: ', err);
    }
  }

  setUserObject(object: any, id: string): UserProfile {
    return {
      id: id || '',
      userName: object.userName || '',
      email: object.emai || '',
      avatar: object.avatar || '',
      active: object.active || false
    }
  }

  subUserList() {
    return onSnapshot(this.getUserRef(), (list) => {
      const users: UserProfile[] = [];
      list.forEach((item) => {
        users.push(this.setUserObject(item.data(), item.id));
      });
      this.userListSig.set(users);
    })
  }

  getUserRef() {
    return collection(this.usersDb, 'users');
  }

  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.usersDb, colId), docId);
  }

  subScribeToUser(id: string) {
    onSnapshot(this.getSingleDocRef('users', id), (doc) => {
      if (doc.exists()) {
        this.currentUserSig.set(doc.data() as UserProfile);
        console.log('User set: ', this.currentUserSig());
      } else {
        console.log('User does not exist!');
        this.currentUserSig.set(null);
      }
    });
  }
}
