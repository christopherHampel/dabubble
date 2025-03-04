import { effect, inject, Injectable, signal } from '@angular/core';
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
  userSig = signal<UserProfile | null>(null);
  userListSig = signal<UserProfile[]>([]);
  unsubUser: any;
  unsubUserList: any;


  constructor() {
    this.auth.currentAuthUser.subscribe((user) => {
      if (user) {
        this.subUser(user.uid, (updateUser) => {
          this.currentUserSig.set(updateUser);
        });
      }
    })

    effect(() => {
      this.subUserList();
    })
  }


  get currentUser() {
    return this.currentUserSig();
  }


  get user() {
    return this.userSig();
  }


  get userList() {
    return this.userListSig();
  }


  ngOnDestroy() {
    this.unsubUser();
    this.unsubUserList();
  }


  async addUser(user: any) {
    const userRef = doc(this.getUserRef(), user.id);
    await setDoc(userRef, user);
  }


  async addDirectMessageWith(id: string) {
    await updateDoc(this.getSingleDocRef('users', this.currentUser!.id), {
      directmessagesWith: arrayUnion(id)
    })
  }


  setUserObject(object: any, id: string): UserProfile {
    return {
      id: id || '',
      userName: object.userName || '',
      email: object.email || '',
      avatar: object.avatar || '',
      active: object.active || false,
      clicked: object.clicked || false,
      directmessagesWith: object.directmessagesWith || []
    }
  }


  subUser(id: string, callback?: (user: UserProfile) => void) {
    return onSnapshot(this.getSingleDocRef('users', id), (doc) => {
      const updateUser = this.setUserObject(doc.data(), id)

      if (callback) {
        callback(updateUser);
      }
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
      await updateDoc(docRef, this.getCleanJson(user))
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
    updateDoc(userRef, { clicked: clicked });
  }


  updateUserStatus(userId: string, active: boolean) {
    const userRef = this.getSingleDocRef('users', userId);
    updateDoc(userRef, { active: active });
  }
}
