import { Injectable, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { collection, doc, addDoc, updateDoc, query, where, getDocs,  onSnapshot, serverTimestamp, orderBy, Timestamp } from 'firebase/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { UsersDbService } from '../usersDb/users-db.service';
import { AuthService } from '../auth/auth.service';
import { CurrentMessage } from '../../interfaces/current-message';

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

  constructor(private router: Router, public usersService: UsersDbService, public authService: AuthService) { }

  async setPrivateChat(name: string): Promise<string> {
    const nameLogedinUser = this.usersService.currentUserSig()?.userName;
    console.log(nameLogedinUser);
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

  async getQuerySnapshot(messageTimestamp: Timestamp) {
    if (this.chatId) {
      const chatRef = collection(this.getPrivateChatCollection(), this.chatId, 'messages');
      const chatQuery = query(chatRef, where('createdAt', '==', messageTimestamp));
      return await getDocs(chatQuery);
    }
    throw new Error('chatId ist nicht definiert');
  }
  
  async updateMessage(messageTimestamp: Timestamp, newText: string) {
    try {
      const querySnapshot = await this.getQuerySnapshot(messageTimestamp);
  
      if (!querySnapshot.empty) {
        const messageDoc = querySnapshot.docs[0];
        await updateDoc(messageDoc.ref, { text: newText });
      } else {
        console.error('Keine Nachricht gefunden');
      }
    } catch (error) {
      console.error(error);
    }
  }
  
  async addEmoji(messageTimestamp: Timestamp, emoji: string) {
    try {
      const querySnapshot = await this.getQuerySnapshot(messageTimestamp);
  
      if (!querySnapshot.empty) {
        const messageDoc = querySnapshot.docs[0];
        const messageData = messageDoc.data();
  
        let emojis = messageData['emojis'] || [];
        const existingEmojiIndex = emojis.findIndex((e: any) => e.emoji === emoji);
  
        if (existingEmojiIndex !== -1) {
          const existingEmoji = emojis[existingEmojiIndex];
  
          if (!existingEmoji.userIds.includes(this.usersService.currentUserSig()?.id)) {
            existingEmoji.count += 1;
            existingEmoji.userIds.push(this.usersService.currentUserSig()?.id);
          }
        } else {
          emojis.push({
            emoji: emoji,
            count: 1,
            userIds: [this.usersService.currentUserSig()?.id],
          });
        }
  
        await updateDoc(messageDoc.ref, { emojis: emojis });
      }
    } catch (error) {
      console.error(error);
    }
  }
  
  async increaseValueOfEmoji(emoji: string, currentMessage: CurrentMessage) {
    const messageTimestamp = currentMessage.createdAt;
    const querySnapshot = await this.getQuerySnapshot(messageTimestamp);
  
    if (!querySnapshot.empty) {
      const messageDoc = querySnapshot.docs[0];
      const messageData = messageDoc.data();
  
      let emojis = messageData['emojis'] || [];
      const existingEmojiIndex = emojis.findIndex((e: any) => e.emoji === emoji);
  
      if (existingEmojiIndex !== -1) {
        const existingEmoji = emojis[existingEmojiIndex];
  
        // Prüfen, ob der Benutzer das Emoji bereits benutzt hat
        if (!existingEmoji.userIds.includes(this.usersService.currentUserSig()?.id)) {
          existingEmoji.count += 1;
          existingEmoji.userIds.push(this.usersService.currentUserSig()?.id);
  
          // Aktualisieren des Dokuments
          await updateDoc(messageDoc.ref, { emojis: emojis });
        } else {
          console.log("Dieser Benutzer hat dieses Emoji bereits benutzt.");
        }
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