import { Injectable, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { collection, doc, addDoc, updateDoc, query, where, getDocs, arrayUnion, onSnapshot, deleteDoc, deleteField, getDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatsService {

  firestore = inject(Firestore);
  currentChatId:string = '';
  chatData: any = null;
  chatId?: string;;

  getPrivateChatCollection() {
    return collection(this.firestore, 'messages');
  }

  getChannelCollection() {
    return collection(this.firestore, 'channels');
  }

  constructor(private router: Router) { }

  async setPrivateChat(name: string): Promise<string> {
    const chatCollection = this.getPrivateChatCollection();
    const chatQuery = query(chatCollection, where('name', '==', name));
    const querySnapshot = await getDocs(chatQuery);

    if (!querySnapshot.empty) {
      const existingDoc = querySnapshot.docs[0];
      this.currentChatId = existingDoc.id;
      // console.log('Bestehender Chat gefunden mit ID:', existingDoc.id);
      return existingDoc.id;
    } else {
      const docRef = await addDoc(chatCollection, { name: name });
      this.currentChatId = docRef.id;
      // console.log('Neuer Chat erstellt mit ID:', docRef.id);
      return docRef.id;
    }
  }

  async setChannel() {
    
  }

  getData(chatId:string): Observable<any> {
    return new Observable(observer => {
      const docRef = doc(this.firestore, 'messages', chatId);
      const unsubscribe = onSnapshot(docRef, docSnap => {
        if (docSnap.exists()) {
          observer.next(docSnap.data());
        } else {
          observer.error('Kein Dokument gefunden!');
        }
      }, error => {
        observer.error(error);
      });
      // Bereinigen des Abonnements
      return () => unsubscribe();
    });
  }

  getChatData(chatId: string) {
    this.getData(chatId).subscribe({
      next: (data) => {
        this.chatData = data;
      },
      error: (err) => {
        console.error('Fehler beim Abrufen der Chat-Daten:', err);
      }
    });
  }

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

async deleteMessage(i: number) {
  const messageField = doc(this.getPrivateChatCollection(), this.chatId);
  const docSnap = await getDoc(messageField);

  if (docSnap.exists()) {
    const data = docSnap.data();
    const messages = data['messages'] || [];

    if (i >= 0 && i < messages.length) {
      messages.splice(i, 1);

      await updateDoc(messageField, {
        messages: messages,
      });
    }
  } 
}
}