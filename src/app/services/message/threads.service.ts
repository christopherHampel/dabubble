import { inject, Injectable } from '@angular/core';
import { collection, doc, Firestore, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ThreadsService {
  private threads = inject(Firestore);

  constructor() { }

  async addThread(message: any) {
    const threadRef = doc(this.getUserRef(), message);
    await setDoc(threadRef, message);
  }

  getUserRef() {
    return collection(this.threads, 'threads');
  }
}
