import { Injectable, inject } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection, doc, addDoc, updateDoc, query, where, getDocs,  onSnapshot, serverTimestamp, orderBy, Timestamp, getDoc } from 'firebase/firestore';
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

  chatPartner!: {name:string, avatar:string};
  unsubscribe: any;
  unsub: any;
  chatData: any = '';
  chatMessages:any = '';

  getChatInformationen(chatId: string) {
    const unsub = onSnapshot(doc(this.getPrivateChatCollection(), chatId), (doc) => {
      if (doc.exists()) {
        this.chatData = doc.data();
        this.setChatPartner();
        this.getMessagesFromChat(chatId);
      } else {
        console.log("Chat-Daten existieren nicht.");
      }
    });
  
    // Rückgabe der unsubscribe-Funktion, falls du später die Überwachung stoppen möchtest
    return unsub;
  }

  setChatPartner() {
    const currentUserId = this.usersService.currentUserSig()?.id;

    if (this.chatData && this.chatData.participantsDetails) {
      const otherParticipantId = this.chatData.participants.find((id: string) => id !== currentUserId);

      if (otherParticipantId) {
        const otherParticipantDetails = this.chatData.participantsDetails[otherParticipantId];
        this.chatPartner = {
          name: otherParticipantDetails ? otherParticipantDetails.name : 'Unbekannter Teilnehmer',
          avatar: otherParticipantDetails ? otherParticipantDetails.avatar : '/img/empty_profile.png',
        };
      }
    }
  }

  async getMessagesFromChat(chatId:string) {
    const messagesRef = collection(this.getPrivateChatCollection(), chatId, "messages");
    const sortedQuery = query(messagesRef, orderBy("createdAt", "asc")); // Nach Timestamp aufsteigend sortieren
    const messages:any = []

    const unsubscribe = onSnapshot(sortedQuery, (querySnapshot) => {
      messages.length = 0;
      querySnapshot.forEach((doc) => {
        const message = doc.data()
        messages.push(message);
      });
      console.log(messages)
      this.chatMessages = messages;
    });
    return unsubscribe;
  }

  ngonDestroy() {
    this.unsubscribe();
  }

  getPrivateChatCollection() {
    return collection(this.firestore, 'messages');
  }

  getSingleDocRef(collId:string, docId:string) {
    return doc(collection(this.firestore, collId), docId);
  }

  constructor(
    public usersService: UsersDbService, 
    public authService: AuthService) {  }

    async setPrivateChat(chatPartner: UserProfile): Promise<string> {
      const currentUser = this.checkCurrentUser();
      const chatId = this.generateChatId(currentUser.id, chatPartner.id);
  
      const existingChatId = await this.findExistingChat(chatId);
      if (existingChatId) {
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
      return docRef.id;
    }

  async addTextToChat(text: string, chatId:string): Promise<void> {
    const nameLogedinUser = this.usersService.currentUserSig()?.userName;
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
  //   const chatId = this.chatIdSubject.value; // Die aktuelle chatId abrufen

  //   if (chatId) {
  //     const chatRef = collection(this.getPrivateChatCollection(), chatId, 'messages');
  //     const chatQuery = query(chatRef, where('createdAt', '==', messageTimestamp));
  //     return await getDocs(chatQuery);
  //   }
  //   throw new Error('chatId ist nicht definiert');
  }
  
  async updateMessage(messageTimestamp: Timestamp, newText: string) {
    // try {
    //   const querySnapshot = await this.getQuerySnapshot(messageTimestamp);
  
    //   if (!querySnapshot.empty) {
    //     const messageDoc = querySnapshot.docs[0];
    //     await updateDoc(messageDoc.ref, { text: newText });
    //   } else {
    //     console.error('Keine Nachricht gefunden');
    //   }
    // } catch (error) {
    //   console.error(error);
    // }
  }
  
  async addEmoji(messageTimestamp: Timestamp, emoji: string) {
    // try {
    //   const querySnapshot = await this.getQuerySnapshot(messageTimestamp);
  
    //   if (!querySnapshot.empty) {
    //     const messageDoc = querySnapshot.docs[0];
    //     const messageData = messageDoc.data();
  
    //     let emojis = messageData['emojis'] || [];
    //     const existingEmojiIndex = emojis.findIndex((e: any) => e.emoji === emoji);
  
    //     if (existingEmojiIndex !== -1) {
    //       const existingEmoji = emojis[existingEmojiIndex];
  
    //       if (!existingEmoji.userIds.includes(this.usersService.currentUserSig()?.id)) {
    //         existingEmoji.count += 1;
    //         existingEmoji.userIds.push(this.usersService.currentUserSig()?.id);
    //       }
    //     } else {
    //       emojis.push({
    //         emoji: emoji,
    //         count: 1,
    //         userIds: [this.usersService.currentUserSig()?.id],
    //       });
    //     }
  
    //     await updateDoc(messageDoc.ref, { emojis: emojis });
    //   }
    // } catch (error) {
    //   console.error(error);
    // }
  }
  
  async increaseValueOfEmoji(emoji: string, currentMessage: CurrentMessage) {
    // const messageTimestamp = currentMessage.createdAt;
    // const querySnapshot = await this.getQuerySnapshot(messageTimestamp);
  
    // if (!querySnapshot.empty) {
    //   const messageDoc = querySnapshot.docs[0];
    //   const messageData = messageDoc.data();
  
    //   let emojis = messageData['emojis'] || [];
    //   const existingEmojiIndex = emojis.findIndex((e: any) => e.emoji === emoji);
  
    //   if (existingEmojiIndex !== -1) {
    //     const existingEmoji = emojis[existingEmojiIndex];
  
    //     if (!existingEmoji.userIds.includes(this.usersService.currentUserSig()?.id)) {
    //       existingEmoji.count += 1;
    //       existingEmoji.userIds.push(this.usersService.currentUserSig()?.id);
  
    //       await updateDoc(messageDoc.ref, { emojis: emojis });
    //     } else {
    //       console.log("Dieser Benutzer hat dieses Emoji bereits benutzt.");
    //     }
    //   }
    // }
  }

//   getMessageData(chatId: string): void {
//     const docRef = doc(this.firestore, 'messages', chatId);
  
//     onSnapshot(docRef, (docSnap) => {
//       if (docSnap.exists()) {
//         const chatData = docSnap.data();
//         const subCollectionRef = collection(docRef, 'messages');
//         const sortedQuery = query(subCollectionRef, orderBy('createdAt', 'asc'));
  
//         onSnapshot(sortedQuery, querySnap => {
//           const messages = querySnap.docs.map(doc => doc.data());
//           chatData['messages'] = messages;
//           this.chatDataSubject.next(chatData);
//         });
//       } else {
//         console.error('Kein Dokument gefunden!');
//         this.chatDataSubject.next(null);
//       }
//     });
//   }
}