import { Injectable, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { collection, doc, addDoc, updateDoc, query, where, getDocs, arrayUnion, onSnapshot, deleteDoc, deleteField, getDoc } from 'firebase/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';
// import { UsersDbService } from '../usersDb/users-db.service';

@Injectable({
  providedIn: 'root'
})
export class ChatsService {

  firestore = inject(Firestore);
  currentChatId:string = '';
  private chatDataSubject = new BehaviorSubject<any>(null);
  chatData$ = this.chatDataSubject.asObservable();  
  chatId?: string;;

  getPrivateChatCollection() {
    return collection(this.firestore, 'messages');
  }

  getChannelCollection() {
    return collection(this.firestore, 'channels');
  }

  constructor(private router: Router, public authService: AuthService) { }

  async setPrivateChat(name: string): Promise<string> {
    const nameLogedinUser = this.authService.currentUserExample[0].name;
    const chatCollection = this.getPrivateChatCollection();
    const chatQuery = query(chatCollection, where('participant', '==', name), where('logedinUser', '==', nameLogedinUser));
    const querySnapshot = await getDocs(chatQuery);

    if (!querySnapshot.empty) {
      const existingDoc = querySnapshot.docs[0];
      this.currentChatId = existingDoc.id;
      // console.log('Bestehender Chat gefunden mit ID:', existingDoc.id);
      return existingDoc.id;
    } else {
      const docRef = await addDoc(chatCollection, 
        { logedinUser: nameLogedinUser,
          participant: name,
        });
      this.currentChatId = docRef.id;
      // console.log('Neuer Chat erstellt mit ID:', docRef.id);
      return docRef.id;
    }
  }

  async addTextToChat(text: string, chatId: string): Promise<void> {
    const nameLogedinUser = this.authService.currentUserExample[0].name;
    if (!chatId) {
      throw new Error('Ungültige Chat-ID');
    }
    const chatRef = doc(this.getPrivateChatCollection(), chatId);
    const messagesRef = collection(chatRef, 'messages');

    await addDoc(messagesRef, {
        uid: nameLogedinUser,
        text: text,
        timestamp: new Date(),
    })
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

  getChatData(chatId: string): void {
    const docRef = doc(this.firestore, 'messages', chatId);

    // Abonniere das Hauptdokument
    onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const chatData = docSnap.data();
        const subCollectionRef = collection(docRef, 'messages'); // Hier ist die Subcollection

        // Abonniere die Subcollection "messages"
        onSnapshot(subCollectionRef, querySnap => {
          const messages = querySnap.docs.map(doc => doc.data()); // Extrahiere die Nachrichten
          chatData['messages'] = messages; // Füge die Nachrichten zu den Hauptdaten hinzu
          this.chatDataSubject.next(chatData); // Aktualisiere das BehaviorSubject mit den neuen Daten
        });
      } else {
        console.error('Kein Dokument gefunden!');
        this.chatDataSubject.next(null); // Null setzen, wenn keine Daten gefunden wurden
      }
    });
  }

}