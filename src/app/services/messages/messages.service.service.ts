import { Injectable, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { collection, doc, setDoc, addDoc, updateDoc, getDoc, query, where, getDocs, arrayUnion } from 'firebase/firestore';

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

  async getChatData(chatId: string) {
    const docRef = doc(this.getPrivateChatCollection(), chatId);
    const docSnap = await getDoc(docRef);
  
    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      console.error('Kein Dokument gefunden!');
      return null;
    }
  }

  async addTextToChat(text:string, chatId:any) {
    const chatRef = doc(this.getPrivateChatCollection(), chatId);
    await updateDoc(chatRef, {
      messages: arrayUnion({
        // userId: this.uid,
        text: text,
        timestamp: new Date(), // Optionale Zeitstempelung
      })
    });
  }
}
