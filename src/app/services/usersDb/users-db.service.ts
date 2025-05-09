import { effect, inject, Injectable, signal } from '@angular/core';
import { arrayUnion, collection, doc, Firestore, getDoc, onSnapshot, setDoc, updateDoc } from '@angular/fire/firestore';
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
  triggerAddUserIdSig = signal<string>('');

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

  triggerAddUserId(id: string) {
    this.triggerAddUserIdSig.set(id);

    setTimeout(() => this.triggerAddUserIdSig.set(''), 250);
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
      channelFriendHighlighted: object.clicked || object.channelFriendHighlighted,
      directmessagesWith: object.directmessagesWith || []
    }
  }


  subUser(id: string, callback: (user: UserProfile) => void) {
    try {
      return onSnapshot(this.getSingleDocRef('users', id), (doc) => {
        if(doc.exists()) {
          const updateUser = this.setUserObject(doc.data(), id)
          callback(updateUser);
        }

      });
    } catch (error) {
      console.log('Fehler userName: ', error);
      return;
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


  getCleanJson(user: UserProfile): {} {
    return {
      id: user.id,
      userName: user.userName,
      email: user.email,
      avatar: user.avatar,
      active: user.active,
      channelFriendHighlighted: user.channelFriendHighlighted,
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


  updateUserStatus(userId: string, active: boolean) {
    const userRef = this.getSingleDocRef('users', userId);
    updateDoc(userRef, { active: active });
  }

  updateCurrentUserProfil(userName: string, avatar: string) {
    const userRef = this.getSingleDocRef('users', this.currentUser!.id);
    updateDoc(userRef, { userName: userName, avatar: avatar });
  }

  updateChanelFriendHighlighted(id: string) {
    const userRef = this.getSingleDocRef('users', this.currentUser!.id);
    updateDoc(userRef, { channelFriendHighlighted: id })
  }

  async getUserById(userId: string): Promise<any | null> {
    const userRef = doc(this.usersDb, `users/${userId}`);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data(); // Der Benutzer existiert
    } else {
      return null; // Benutzer nicht gefunden
    }
  }
}
