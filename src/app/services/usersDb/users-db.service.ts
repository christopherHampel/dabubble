import { inject, Injectable, signal } from '@angular/core';
import { arrayUnion, collection, doc, Firestore, onSnapshot, setDoc, updateDoc } from '@angular/fire/firestore';
import { UserProfile } from '../../interfaces/userProfile';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class UsersDbService {
  usersDb = inject(Firestore)
  auth = inject(AuthService)

  currentUserSig = signal<UserProfile | null>(null);
  unsubUser: any;
  userListSig = signal<UserProfile[]>([]);
  unsubUserList;

  constructor() {
    this.auth.currentAuthUser.subscribe((user) => {
      if (user) {
        this.unsubUser = this.subUser(user.uid);
      }
    })
    this.unsubUserList = this.subUserList();
  }

  get currentUser() {
    return this.currentUserSig();
  }

  get userList() {
    return this.userListSig();
  }

  ngOnDestroy() {
    this.unsubUser();
    this.unsubUserList();
  }

  async addUser(user: any) {
    try {
      const userRef = doc(this.getUserRef(), user.id);
      await setDoc(userRef, user);
      console.log('User addes successfully with ID: ', user);
    } catch (err) {
      console.log('Error during add user: ', err);
    }
  }

  async addDirectMessageWith(id: string) {
    try {
      await updateDoc(this.getSingleDocRef('users', this.currentUserSig()!.id), {
        directmessagesWith: arrayUnion(id)
      })
      console.log('Drictmessage successfully added: ', id);
    } catch (err) {
      console.log('Error added directmessage: ', err);
    }
  }

  setUserObject(object: any, id: string): UserProfile {
    return {
      id: id || '',
      userName: object.userName || '',
      email: object.emai || '',
      avatar: object.avatar || '',
      active: object.active || false,
      clicked: object.clicked || false,
      directmessagesWith: object.directmessagesWith || []
    }
  }

  subUser(id: string) {
    return onSnapshot(this.getSingleDocRef('users', id), (doc) => {
      this.currentUserSig.set(this.setUserObject(doc.data(), id));
    });
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

  getCleanJson(user: UserProfile): {} {
    return {
      id: user.id,
      userName: user.userName,
      email: user.email,
      avatar: user.avatar,
      active: user.active,
      clicked: user.clicked,
      directmessagesWith: user.directmessagesWith
    }
  }

  async updateUser(user: UserProfile) {
    if (user.id) {
      let docRef = this.getSingleDocRef('users', user.id);
      await updateDoc(docRef, this.getCleanJson(user)).catch(
        (err) => (console.log(err))
      );
    }
  }

  getUserRef() {
    return collection(this.usersDb, 'users');
  }

  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.usersDb, colId), docId);
  }

  updateClickStatus(userId: string, clicked: boolean) {
    const userRef = this.getSingleDocRef('users', userId);
    setDoc(userRef, { clicked: clicked }, { merge: true });
  }

  updateUserStatus(userId: string, active: boolean) {
    const userRef = this.getSingleDocRef('users', userId);
    setDoc(userRef, { active: active }, { merge: true });
  }
}
