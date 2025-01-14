import { inject, Injectable } from '@angular/core';
import { addDoc, collection, doc, Firestore, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ThreadsDbService {
  private threads = inject(Firestore);

  constructor() { }

  async addThread(thread: any) {
    await addDoc(this.getUserRef(), thread)
    .then((docRef) => {
      console.log('Add thread: ', docRef.id)
    });
  }

  getUserRef() {
    return collection(this.threads, 'threads');
  }
}
