import { Injectable, inject, signal } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection, doc, addDoc, updateDoc, query, where, getDocs, onSnapshot, serverTimestamp, orderBy, limit } from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
// import { CurrentMessage } from '../../interfaces/current-message';
import { UserProfile } from '../../interfaces/userProfile';
import { UsersDbService } from '../usersDb/users-db.service';

@Injectable({
  providedIn: 'root'
})
export class ChatsService {

  firestore = inject(Firestore);
  component = signal<'chat' | 'thread'>('chat');

  private messagesSubject = new BehaviorSubject<any[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  chatPartner: { name: string, avatar: string } = { name: '', avatar: '' };
  unsubMessage: any;
  unsubChatInfo: any;
  chatData: any = '';
  chatMessages: any = '';

  currentChatId!: string;

  getPrivateChatCollection() {
    console.log('Component chat service: ', this.component);
    if (this.component() == 'chat') {
      return collection(this.firestore, 'messages');
    } else {
      return collection(this.firestore, 'threads');
    }
  }

  getSingleDocRef(collId: string, docId: string) {
    return doc(collection(this.firestore, collId), docId);
  }

  getSubColMessages(chatId: string) {
    return collection(this.getPrivateChatCollection(), chatId, "messages");
  }

  getUserName() {
    return this.usersService.currentUserSig()?.userName;
  }

  getUserId() {
    return this.usersService.currentUserSig()?.id;
  }

  async getChatInformationen(chatId: string) {
    this.unsubChatInfo = onSnapshot(doc(this.getPrivateChatCollection(), chatId), (chat) => {
      if (chat.exists()) {
        this.chatData = chat.data();
        this.getMessagesFromChat(chatId);
        this.setChatPartner();
      } else {
        console.log("Chat-Daten existieren nicht.");
      }
    });
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

  async getMessagesFromChat(chatId: string) {
    const messagesRef = this.getSubColMessages(chatId)
    const sortedQuery = query(messagesRef, orderBy("createdAt", "asc"));
    const messages: any = [];

    this.unsubMessage = onSnapshot(sortedQuery, (querySnapshot) => {
      messages.length = 0;
      querySnapshot.forEach((doc) => {
        const message = doc.data()
        messages.push(message);
      });
      console.log(messages)
      this.messagesSubject.next(messages);
    });
  }

  ngonDestroy() {
    this.unsubChatInfo();
    this.unsubMessage();
  }

  constructor(
    public usersService: UsersDbService,
    public authService: AuthService) { }

  async setPrivateChat(chatPartner: UserProfile): Promise<string> {
    const currentUser = this.checkCurrentUser();
    const chatId = this.generateChatId(currentUser.id, chatPartner.id);

    const existingChatId = await this.findExistingChat(chatId);
    if (existingChatId) {
      return existingChatId;
    }
    return this.createNewPrivateChat(currentUser, chatPartner, chatId);
  }

  private checkCurrentUser(): any {
    const currentUser = this.usersService.currentUserSig();
    // const currentUser = '122gssssdsdhfdjshfjdshf';
    if (!currentUser) {
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

  async addMessageToChat(text: string, chatId: string): Promise<void> {
    const messageAuthor = {
      name: this.getUserName(),
      id: this.getUserId()
    }
    const chatRef = doc(this.getPrivateChatCollection(), chatId);
    const messagesRef = collection(chatRef, 'messages');

    const isFirstMessageOfDay = await this.checkFirstMessage(chatId);

    await addDoc(messagesRef, {
      messageAuthor: messageAuthor,
      text: text,
      createdAt: serverTimestamp(),
      firstMessageOfTheDay: isFirstMessageOfDay,
      emojis: [],
    }).then(docRef => {
      updateDoc(docRef, {
        docId: docRef.id,
      })
    })
  }

  async getQuerySnapshot(docId: string, chatId: string,) {
    if (docId) {
      const chatRef = collection(this.getPrivateChatCollection(), chatId, 'messages');
      const chatQuery = query(chatRef, where('docId', '==', docId));
      return await getDocs(chatQuery);
    }
    throw new Error('chatId ist nicht definiert');
  }

  async updateMessage(docId: string, newText: string, chatId: string) {
    const querySnapshot = await this.getQuerySnapshot(docId, chatId);

    if (!querySnapshot.empty) {
      const messageDoc = querySnapshot.docs[0];
      await updateDoc(messageDoc.ref, { text: newText });
    } else {
      console.error('Keine Nachricht gefunden');
    }
  }

  async addEmoji(currentMessage: any, emoji: string, chatId: string) {
    const query = await this.getQuerySnapshot(currentMessage.docId, chatId);
    const messageDoc = query.docs[0];
    const messageData = messageDoc.data();
    const emojis = messageData['emojis'] || [];
    
    const currentUserId = this.usersService.currentUserSig()?.id;
    const currentUserName = this.usersService.currentUserSig()?.userName;
  
    const existingEmoji = emojis.find((e: any) => e.emoji === emoji);
    
    if (existingEmoji) {
      if (!existingEmoji.id.includes(currentUserId)) {
        existingEmoji.count += 1;
        existingEmoji.id.push(currentUserId);
        existingEmoji.name.push(currentUserName);
      }
    } else {
      const emojiPackage = {
        emoji: emoji,
        count: 1,
        id: [currentUserId],
        name: [currentUserName]
      };
      emojis.push(emojiPackage);
    }
  
    await updateDoc(messageDoc.ref, { emojis });
  }

  async checkFirstMessage(chatId: string): Promise<boolean> {
    const chatRef = doc(this.getPrivateChatCollection(), chatId);
    const messagesRef = collection(chatRef, 'messages');
    const messagesQuery = query(
      messagesRef,
      orderBy('createdAt', 'desc'),
      limit(1)
    );
  
    const querySnapshot = await getDocs(messagesQuery);
  
    if (querySnapshot.empty) {
      return true;
    }
  
    const lastMessage = querySnapshot.docs[0].data();
    const lastMessageDate = lastMessage['createdAt'].toDate();
  
    const now = new Date();
  
    const isNewDay =
      now.getFullYear() > lastMessageDate.getFullYear() ||
      now.getMonth() > lastMessageDate.getMonth() ||
      now.getDate() > lastMessageDate.getDate();
  
    return isNewDay;
  }
}