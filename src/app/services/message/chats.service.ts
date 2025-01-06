import { Injectable, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection, doc, addDoc, updateDoc, query, where, getDocs,  onSnapshot, serverTimestamp, orderBy, Timestamp } from 'firebase/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { UsersDbService } from '../usersDb/users-db.service';
import { AuthService } from '../auth/auth.service';
import { CurrentMessage } from '../../interfaces/current-message';
import { UserProfile } from '../../interfaces/userProfile';

@Injectable({
  providedIn: 'root'
})
export class ChatsService {

  firestore = inject(Firestore);
  private chatIdSubject = new BehaviorSubject<string | null>(null); 
  chatDataSubject = new BehaviorSubject<any>(null);
  chatData$ = this.chatDataSubject.asObservable(); 
  chatId$ = this.chatIdSubject.asObservable();

  getPrivateChatCollection() {
    return collection(this.firestore, 'messages');
  }

  getChannelCollection() {
    return collection(this.firestore, 'channels');
  }

  constructor(
    public usersService: UsersDbService, 
    public authService: AuthService) {     
      this.chatId$.subscribe(chatId => {
        if (chatId) {
          this.getMessageData(chatId);
          console.log(this.chatId$)
        }
      }); 
    }

    setChatId(chatId: string): void {
      this.chatIdSubject.next(chatId);
    } 

    async setPrivateChat(chatPartner: UserProfile): Promise<string> {
      const currentUser = this.checkCurrentUser();
      const chatId = this.generateChatId(currentUser.id, chatPartner.id);
  
      const existingChatId = await this.findExistingChat(chatId);
      if (existingChatId) {
        this.setChatId(existingChatId);
        return existingChatId;
      }
      return this.createNewPrivateChat(currentUser, chatPartner, chatId);
    }

    private checkCurrentUser(): UserProfile {
      const currentUser = this.usersService.currentUserSig();
      if (!currentUser?.id) {
        throw new Error("Current user ID is undefined.");
      }
      return currentUser;
    }

    private generateChatId(currentUserId: string, chatPartnerId: string): string {
      const sortedIds = [currentUserId, chatPartnerId].sort();
      return sortedIds.join('_');
    }

    private async findExistingChat(chatId: string): Promise<any> {
      const chatQuery = query(this.getPrivateChatCollection(), where('chatId', '==', chatId));
      const querySnapshot = await getDocs(chatQuery);
  
      if (!querySnapshot.empty) {
        const existingDoc = querySnapshot.docs[0];
        return existingDoc.id;
      }
      return null;
    }

    private async createNewPrivateChat(currentUser: UserProfile, chatPartner: UserProfile, chatId: string): Promise<string> {
      const docRef = await addDoc(this.getPrivateChatCollection(), {
        participants: [currentUser.id, chatPartner.id].sort(),
        chatId,
        participantsDetails: {
          [currentUser.id]: {
            name: currentUser.userName,
            avatar: currentUser.avatar,
          },
          [chatPartner.id]: {
            name: chatPartner.userName,
            avatar: chatPartner.avatar,
          },
        },
      });
      this.setChatId(docRef.id);
      return docRef.id;
    }

  async addTextToChat(text: string): Promise<void> {
    const chatId = this.chatIdSubject.value;

    const nameLogedinUser = this.usersService.currentUserSig()?.userName;
    console.log(nameLogedinUser);
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
    const chatId = this.chatIdSubject.value; // Die aktuelle chatId abrufen

    if (chatId) {
      const chatRef = collection(this.getPrivateChatCollection(), chatId, 'messages');
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
  
        if (!existingEmoji.userIds.includes(this.usersService.currentUserSig()?.id)) {
          existingEmoji.count += 1;
          existingEmoji.userIds.push(this.usersService.currentUserSig()?.id);
  
          await updateDoc(messageDoc.ref, { emojis: emojis });
        } else {
          console.log("Dieser Benutzer hat dieses Emoji bereits benutzt.");
        }
      }
    }
  }


  // getData(chatId:string): Observable<any> {
  //   return new Observable(observer => {
  //     const docRef = doc(this.firestore, 'messages', chatId);
  //     const unsubscribe = onSnapshot(docRef, docSnap => {
  //       if (docSnap.exists()) {
  //         observer.next(docSnap.data());
  //       } else {
  //         observer.error('Kein Dokument gefunden!');
  //       }
  //     }, error => {
  //       observer.error(error);
  //     });
  //     return () => unsubscribe();
  //   });
  // }

  getMessageData(chatId: string): void {
    const docRef = doc(this.firestore, 'messages', chatId);
  
    onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const chatData = docSnap.data();
        const subCollectionRef = collection(docRef, 'messages');
        const sortedQuery = query(subCollectionRef, orderBy('createdAt', 'asc'));
  
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