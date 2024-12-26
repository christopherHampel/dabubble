import { Injectable, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { collection, doc, setDoc, addDoc, updateDoc, getDoc, query, where, getDocs, arrayUnion, onSnapshot } from 'firebase/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessagesServiceService {

  firestore = inject(Firestore);
  currentChatId:string = '';

  constructor(private router: Router) { }

  getPrivateChatCollection() {
    return collection(this.firestore, 'messages');
  }

  async setPrivateChat(name: string): Promise<string> {
    const chatCollection = this.getPrivateChatCollection();
    const chatQuery = query(chatCollection, where('name', '==', name));
    const querySnapshot = await getDocs(chatQuery);

    if (!querySnapshot.empty) {
      const existingDoc = querySnapshot.docs[0];
      this.currentChatId = existingDoc.id;
      console.log('Bestehender Chat gefunden mit ID:', existingDoc.id);
      return existingDoc.id;
    } else {
    const docRef = await addDoc(chatCollection, { name: name });
    this.currentChatId = docRef.id;
    console.log('Neuer Chat erstellt mit ID:', docRef.id);

    this.addChatroomIdToUser(this.currentChatId, name);
    return docRef.id;
    }
  }

  addChatroomIdToUser(currentChatId:string, name:string) {
    
  }

  getChatData(chatId: string): Observable<any> {
    return new Observable(observer => {
      const docRef = doc(this.firestore, 'messages', chatId);

      // Abonniere die Änderungen mit onSnapshot
      const unsubscribe = onSnapshot(docRef, docSnap => {
        if (docSnap.exists()) {
          observer.next(docSnap.data()); // Sende die Daten an den Observable
        } else {
          observer.error('Kein Dokument gefunden!'); // Fehler, wenn kein Dokument existiert
        }
      }, error => {
        observer.error(error); // Fehler beim Abrufen
      });

      // Bereinigen des Abonnements
      return () => unsubscribe();
    });
  }

  // async getChatData(chatId: string) {
  //   const docRef = doc(this.getPrivateChatCollection(), chatId);
  //   const docSnap = await getDoc(docRef);
  
  //   if (docSnap.exists()) {
  //     return docSnap.data();
  //   } else {
  //     console.error('Kein Dokument gefunden!');
  //     return null;
  //   }
  // }

  // async addTextToChat(text:string, chatId:any) {
  //   const chatRef = doc(this.getPrivateChatCollection(), chatId);
  //   await updateDoc(chatRef, {
  //     messages: arrayUnion({
  //       // userId: this.uid,
  //       text: text,
  //       timestamp: new Date(),
  //     })
  //   });
  // }

  async addTextToChat(text: string, chatId: string): Promise<void> {
    if (!chatId) {
      throw new Error('Ungültige Chat-ID');
    }
  
    const chatRef = doc(this.getPrivateChatCollection(), chatId);
    await updateDoc(chatRef, {
      messages: arrayUnion({
        text: text,
        timestamp: new Date(),
      })
    });
  }
}
