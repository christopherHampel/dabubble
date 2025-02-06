import { Injectable, inject, signal } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { collection, doc, addDoc, updateDoc, query, where, getDocs, onSnapshot, serverTimestamp, orderBy, limit, DocumentData, Unsubscribe } from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
// import { CurrentMessage } from '../../interfaces/current-message';
import { UserProfile } from '../../interfaces/userProfile';
import { UsersDbService } from '../usersDb/users-db.service';
import { ChatData } from '../../interfaces/chat-data';
import { CurrentMessage } from '../../interfaces/current-message';
import { Message } from '../../interfaces/message';

@Injectable({
  providedIn: 'root'
})
export class ChatsService {

  firestore = inject(Firestore);
  component = signal<'chat' | 'thread'>('chat');

  private messagesSubject = new BehaviorSubject<CurrentMessage[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  chatPartner: { name: string, avatar: string } = { name: '', avatar: '' };
  private unsubMessage : Unsubscribe | null = null;
  private unsubChatInfo: Unsubscribe | null = null;
  chatData!: ChatData;
  hasScrolled: boolean = false;
  currentChatId!: string;

  getPrivateChatCollection() {
    // console.log('Component chat service: ', this.component);
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
        this.chatData = chat.data() as ChatData;
        this.getMessagesFromChat(chatId);
        this.setChatPartner();
      } else {
        console.log("Chat-Daten existieren nicht.");
      }
    });
  }

  async setPrivateChat(chatPartner: UserProfile): Promise<string> {
    const currentUser = this.checkCurrentUser();
    const chatId = this.generateChatId(currentUser.id, chatPartner.id);

    const existingChatId = await this.findExistingChat(chatId);
    if (existingChatId) {
      return existingChatId;
    }
    return this.createNewPrivateChat(currentUser, chatPartner, chatId);
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
    const messages: CurrentMessage[] = [];

    this.unsubMessage = onSnapshot(sortedQuery, (querySnapshot) => {
      messages.length = 0;
      querySnapshot.forEach( (doc) => {
        const message = { ...doc.data() } as CurrentMessage;
        // console.log('single message is:', doc.data())
        messages.push(message);
      });
      console.log('Messages is:', messages)
      this.messagesSubject.next(messages);
    });
  }

  ngOnDestroy() {
    this.unsubChatInfo?.();
    this.unsubMessage?.();
  }

  constructor(
    public usersService: UsersDbService,
    public authService: AuthService) { }

  private checkCurrentUser() {
    const currentUser = this.usersService.currentUserSig();
    if (!currentUser) {
      throw new Error("Current user ID is undefined.");
    }
    return currentUser;
  }

  private generateChatId(currentUserId: string, chatPartnerId: string): string {
    const sortedIds = [currentUserId, chatPartnerId].sort();
    return sortedIds.join('_');
  }

  private async findExistingChat(chatId: string): Promise<string | null> {
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
    const chatRef = doc(this.getPrivateChatCollection(), chatId);
    const messagesRef = collection(chatRef, 'messages');
    const messageContent = await this.newMessageContent(text, chatId);

    await addDoc(messagesRef, {
      ...messageContent
    }).then(docRef => {
      updateDoc(docRef, {
        docId: docRef.id,
      })
    })
  }

  async newMessageContent(text:string, chatId:string): Promise<Message> {
    const isFirstMessageOfDay = await this.checkFirstMessage(chatId);

    return {
      docId: '',
      associatedThreadId: '',
      messageAuthor: {
        name: this.getUserName() || '',
        id: this.getUserId() || ''
      },
      text: text,
      createdAt: serverTimestamp(),
      firstMessageOfTheDay: isFirstMessageOfDay,
      emojis: [],
    }
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

  async updateAssociatedThreadId(docId: string, chatId: string, threadId: string) {
    console.log(docId + '   ' + chatId + '   ' + threadId);
    const querySnapshot = await this.getQuerySnapshot(docId, chatId);
    const messageDoc = querySnapshot.docs[0];
    await updateDoc(messageDoc.ref, {associatedThreadId: threadId});
  }

  async checkFirstMessage(chatId: string): Promise<boolean> {
    const lastMessage = await this.getLastMessage(chatId);
    if (!lastMessage) return true;
    return this.isNewDay(lastMessage['createdAt'].toDate());
  }

  private async getLastMessage(chatId: string): Promise<CurrentMessage | null> {
    const messagesQuery = this.createMessagesQuery(chatId);
    const querySnapshot = await getDocs(messagesQuery);
    return querySnapshot.empty ? null : querySnapshot.docs[0].data() as CurrentMessage;
  }

  private createMessagesQuery(chatId: string) {
    const chatRef = doc(this.getPrivateChatCollection(), chatId);
    const messagesRef = collection(chatRef, 'messages');
    return query(messagesRef, orderBy('createdAt', 'desc'), limit(1));
  }

  private isNewDay(lastMessageDate: Date): boolean {
    const now = new Date();
    return (
      now.getFullYear() > lastMessageDate.getFullYear() ||
      now.getMonth() > lastMessageDate.getMonth() ||
      now.getDate() > lastMessageDate.getDate()
    );
  }
}