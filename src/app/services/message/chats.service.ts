import { Injectable, inject } from '@angular/core';
import { collectionData, Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { collection, doc, addDoc, updateDoc, query, where, getDocs, arrayUnion, onSnapshot, deleteDoc, deleteField, getDoc, serverTimestamp, orderBy, Timestamp } from 'firebase/firestore';
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
        createdAt: serverTimestamp(),
        
    })
  }

  async updateMessage(messageTimestamp:Timestamp, newText:string) {
    if(this.chatId) {
      const chatRef = collection(this.getPrivateChatCollection(), this.chatId, 'messages');
      const chatQuery = query(chatRef, where('createdAt', '==', messageTimestamp));
      const querySnapshot = await getDocs(chatQuery);

      if(!querySnapshot.empty) {
        const messageDoc = querySnapshot.docs[0];
        await updateDoc(messageDoc.ref, { text: newText });

      } else {
        return console.error('Keine Nachricht gefunden');
      }
    }
  }

  // async deleteMessage(chatId: string, text: string): Promise<void> {
  //   if (!chatId) {
  //     throw new Error('Ungültige Chat-ID');
  //   }
  
  //   const chatRef = doc(this.getPrivateChatCollection(), chatId);
  //   const messagesRef = collection(chatRef, 'messages');
  
  //   // Suche das Dokument, das den Text enthält
  //   const q = query(messagesRef, where('text', '==', text));
  //   const querySnapshot = await getDocs(q);
  
  //   if (querySnapshot.empty) {
  //     console.log('Kein Dokument gefunden mit dem angegebenen Text');
  //     return;
  //   }
  
  //   // Lösche alle gefundenen Dokumente
  //   for (const docSnapshot of querySnapshot.docs) {
  //     await deleteDoc(docSnapshot.ref);
  //     console.log(`Dokument mit ID ${docSnapshot.id} wurde gelöscht`);
  //   }
  // }

// async deleteMessage(i: number) {
//   const messageField = doc(this.getPrivateChatCollection(), this.chatId);
//   const docSnap = await getDoc(messageField);

//     if (docSnap.exists()) {
//       const data = docSnap.data();
//       const messages = data['messages'] || [];

//       if (i >= 0 && i < messages.length) {
//         messages.splice(i, 1);

//         await updateDoc(messageField, {
//           messages: messages,
//         });
//       }
//     } 
//   }

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
      return () => unsubscribe();
    });
  }

  getMessageData(chatId: string): void {
    const docRef = doc(this.firestore, 'messages', chatId);

    onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const chatData = docSnap.data();
        const subCollectionRef = collection(docRef, 'messages');
        const sortedQuery = query(subCollectionRef, orderBy('createdAt'));

        onSnapshot(sortedQuery, querySnap => {
          const messages = querySnap.docs.map(doc => doc.data());
          chatData['messages'] = messages;
          this.chatDataSubject.next(chatData);
        });
      } else {
        console.error('Kein Dokument gefunden!');
        this.chatDataSubject.next(null);
      }
    });
  }
}