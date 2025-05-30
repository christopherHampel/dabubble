import { Injectable, WritableSignal, effect, inject, signal } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  query,
  where,
  getDocs,
  onSnapshot,
  serverTimestamp,
  orderBy,
  limit,
  Unsubscribe,
  getDoc,
  DocumentReference,
} from 'firebase/firestore';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { UserProfile } from '../../interfaces/userProfile';
import { UsersDbService } from '../usersDb/users-db.service';
import { ChatData } from '../../interfaces/chat-data';
import { CurrentMessage } from '../../interfaces/current-message';
import { SearchDevspaceService } from './search-devspace.service';
import { IncomingMessage } from '../../interfaces/incoming-message';
import { MessageAccesories } from '../../interfaces/message-accesories';

@Injectable({
  providedIn: 'root',
})
export class ChatsService {
  firestore = inject(Firestore);
  component = signal<string>('chat');
  firstThreadMessage = signal<IncomingMessage | null>(null);

  private messagesSubject = new BehaviorSubject<CurrentMessage[]>([]);
  public messages$ = this.messagesSubject.asObservable();

  private searchAbortController: AbortController | null = null;
  private searchTimeout: ReturnType<typeof setTimeout> | undefined = undefined;

  chatPartner: { name: string; avatar: string, id: string } = { name: '', avatar: '', id: '' };
  chatPartnerIdSig = signal<string | null>(null);
  private unsubMessage: Unsubscribe | null = null;
  private unsubChatInfo: Unsubscribe | null = null;
  chatData!: ChatData;
  menu: boolean = false;
  currentChatId!: string;
  indexForNavBarButton = signal<boolean>(false);

  get chatPartnerId() {
    return this.chatPartnerIdSig();
  }

  getChatCollection(component: string) {
    return collection(this.firestore, component);
  }

  getSingleDocRef(collId: string, docId: string) {
    return doc(collection(this.firestore, collId), docId);
  }

  getSubColMessages(chatId: string, component: string) {
    return collection(this.getChatCollection(component), chatId, 'messages');
  }

  getUserName() {
    return this.usersService.currentUserSig()?.userName;
  }

  getUserId() {
    return this.usersService.currentUserSig()?.id;
  }

  getUserAvatar() {
    return this.usersService.currentUserSig()?.avatar;
  }

  async getChatInformationen(chatId: string, component: string) {
    this.unsubChatInfo = onSnapshot(
      doc(this.getChatCollection(component), chatId),
      (chat) => {
        if (chat.exists()) {
          this.chatData = chat.data() as ChatData;
          this.getMessagesFromChat(chatId, 'messages');
          this.setChatPartner();
        } else {
          console.log('Chat-Daten existieren nicht.');
        }
      }
    );
  }

  async setPrivateChat(
    chatPartner: UserProfile,
    component: string
  ): Promise<string> {
    const currentUser = this.checkCurrentUser();
    const chatId = this.generateChatId(currentUser.id, chatPartner.id);

    const existingChatId = await this.findExistingChat(chatId, component);
    if (existingChatId) {
      return existingChatId;
    }
    return this.createNewPrivateChat(
      currentUser,
      chatPartner,
      chatId,
      component
    );
  }

  setChatPartner() {
    const numberOfParticipants = Object.keys(
      this.chatData.participantsDetails
    ).length;
    const currentUserId = this.usersService.currentUserSig()?.id;
    if (numberOfParticipants == 1) {
      this.chatPartner = {
        name:
          this.usersService.currentUserSig()?.userName ||
          'Unbekannter Teilnehmer',
        avatar:
          this.usersService.currentUserSig()?.avatar ||
          '/img/empty_profile.png',
        id:
          this.usersService.currentUserSig()?.id ||
          ''
      };
    }
    if (this.chatData && this.chatData.participantsDetails) {
      const otherParticipantId = this.chatData.participants.find(
        (id: string) => id !== currentUserId
      );

      if (otherParticipantId) {
        const otherParticipantDetails =
          this.chatData.participantsDetails[otherParticipantId];
        this.chatPartner = {
          name: otherParticipantDetails
            ? otherParticipantDetails.name
            : 'Unbekannter Teilnehmer',
          avatar: otherParticipantDetails
            ? otherParticipantDetails.avatar
            : '/img/empty_profile.png',
          id: otherParticipantDetails
            ? otherParticipantId
            : ''
        };
      }
    }
    
    this.chatPartnerIdSig.set(this.chatPartner.id);
  }

  async getMessagesFromChat(chatId: string, component: string) {
    const messagesRef = this.getSubColMessages(chatId, component);
    const sortedQuery = query(messagesRef, orderBy('createdAt', 'asc'));
    const messages: CurrentMessage[] = [];

    this.unsubMessage = onSnapshot(sortedQuery, (querySnapshot) => {
      messages.length = 0;
      querySnapshot.forEach((doc) => {
        const message = { ...doc.data() } as CurrentMessage;
        messages.push(message);
      });
      this.messagesSubject.next(messages);
    });
  }

  ngOnDestroy() {
    this.unsubChatInfo?.();
    this.unsubMessage?.();
  }

  constructor(
    public usersService: UsersDbService,
    public authService: AuthService,
    private searchService: SearchDevspaceService
  ) {
    effect(() => {
      // console.log('SearchTimeout:', this.searchTimeout);
      
      const searchText = this.searchService.searchTextSig().toLowerCase();
  
      if (searchText.length === 0) {
        this.searchService.results = [];
        return;
      }
  
      if (this.searchAbortController) {
        this.searchAbortController.abort();
      }
      this.searchAbortController = new AbortController();
  
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.searchService.searchMessagesInChannels(searchText, 'messages');
      }, 300);
    });
  }

  private checkCurrentUser() {
    const currentUser = this.usersService.currentUserSig();
    if (!currentUser) {
      throw new Error('Current user ID is undefined.');
    }
    return currentUser;
  }

  private generateChatId(currentUserId: string, chatPartnerId: string): string {
    const sortedIds = [currentUserId, chatPartnerId].sort();
    return sortedIds.join('_');
  }

  private async findExistingChat(
    chatId: string,
    component: string
  ): Promise<string | null> {
    const chatQuery = query(
      this.getChatCollection(component),
      where('chatId', '==', chatId)
    );
    const querySnapshot = await getDocs(chatQuery);

    if (!querySnapshot.empty) {
      const existingDoc = querySnapshot.docs[0];
      return existingDoc.id;
    }
    return null;
  }

  private async createNewPrivateChat(
    currentUser: UserProfile,
    chatPartner: UserProfile,
    chatId: string,
    component: string
  ): Promise<string> {
    if (currentUser.id == chatPartner.id) {
      console.log('Eiegner Sprachkanal');
      chatPartner = currentUser;
      const docRef = await addDoc(this.getChatCollection(component), {
        participants: [currentUser.id, chatPartner.id].sort(),
        chatId,
        participantsDetails: {
          [currentUser.id]: {
            name: currentUser.userName,
            avatar: currentUser.avatar,
          },
        },
      });
      return docRef.id;
    }
    const docRef = await addDoc(this.getChatCollection(component), {
      participants: [currentUser.id, chatPartner.id].sort(),
      chatId,
      lastMessageDocId: '',
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

  async addMessageToChat(messageAccesories:MessageAccesories): Promise<void> {
    const chatRef = doc(this.getChatCollection(messageAccesories.component), messageAccesories.chatId);
    const messagesRef = collection(chatRef, 'messages');
    const messageContent = await this.newMessageContent(
      messageAccesories
    );

    await addDoc(messagesRef, {
      ...messageContent,
    }).then((docRef) => {
      updateDoc(docRef, {
        docId: docRef.id,
      });
      const docId = docRef.id;
      this.updateLastMessageDocId(docId, chatRef);
    });
  }

  async newMessageContent(messageAccesories:MessageAccesories): Promise<IncomingMessage> {    
    const isFirstMessageOfDay = await this.checkFirstMessage(messageAccesories.chatId, messageAccesories.component);

    return {
      docId: '',
      associatedThreadId: {
        count: 0,
        lastMessage: '',
        threadId: '',
      },
      messageAuthor: {
        name: this.getUserName() || '',
        id: this.getUserId() || '',
        avatar: this.getUserAvatar() || '',
      },
      text: messageAccesories.message,
      mentionedUsers: messageAccesories.mentionedUsers,
      createdAt: serverTimestamp(),
      firstMessageOfTheDay: isFirstMessageOfDay,
      emojis: [],
      component: messageAccesories.component,
      chatId: messageAccesories.chatId,
      chatPartner: messageAccesories.chatPartner,
    };
  }

  async getQuerySnapshot(docId: string, chatId: string, component: string) {
    if (docId) {
      const chatRef = collection(
        this.getChatCollection(component),
        chatId,
        'messages'
      );
      const chatQuery = query(chatRef, where('docId', '==', docId));
      return await getDocs(chatQuery);
    }
    throw new Error('chatId ist nicht definiert');
  }

  async updateMessage(
    docId: string,
    newText: string,
    chatId: string,
    component: string
  ) {
    const querySnapshot = await this.getQuerySnapshot(docId, chatId, component);

    if (!querySnapshot.empty) {
      const messageDoc = querySnapshot.docs[0];
      await updateDoc(messageDoc.ref, { text: newText });
    } else {
      console.error('Keine Nachricht gefunden');
    }
  }

  async updateAssociatedThreadId(
    docId: string,
    chatId: string,
    threadId: string,
    component: string
  ) {
    const querySnapshot = await this.getQuerySnapshot(docId, chatId, component);
    const messageDoc = querySnapshot.docs[0];
    await updateDoc(messageDoc.ref, {
      associatedThreadId: {
        threadId: threadId,
        count: 0,
        lastMessage: '',
      },
    });
  }

  async checkFirstMessage(chatId: string, component: string): Promise<boolean> {
    const lastMessage = await this.getLastMessage(chatId, component);
    if (!lastMessage) return true;
    return this.isNewDay(lastMessage['createdAt'].toDate());
  }

  private async getLastMessage(
    chatId: string,
    component: string
  ): Promise<CurrentMessage | null> {
    const messagesQuery = this.createMessagesQuery(chatId, component);
    const querySnapshot = await getDocs(messagesQuery);
    return querySnapshot.empty
      ? null
      : (querySnapshot.docs[0].data() as CurrentMessage);
  }

  private createMessagesQuery(chatId: string, component: string) {
    const chatRef = doc(this.getChatCollection(component), chatId);
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

  async updateThreadAnswersCount(
    currentThreadId: string,
  ): Promise<void> {
    const docRef = this.getSingleDocRef('threads', currentThreadId);
    const docSnapshot = await getDoc(docRef);
    const threadData = docSnapshot.data();

    if (threadData) {
      const chatId = threadData['chatId'];
      const currentMessageId = threadData['currentMessageId'];
      this.getMessageByChatIdAndMessageId(
        chatId,
        currentMessageId,
        currentThreadId,
        threadData['component'],
      );
    }
  }

  async getMessageByChatIdAndMessageId(
    chatId: string,
    currentMessageId: string,
    currentThreadId: string,
    component: string,
  ): Promise<void> {
    const querySnapshot = await this.getQuerySnapshot(
      currentMessageId,
      chatId,
      component
    );
    const messageDoc = querySnapshot.docs[0];

    const messageData = messageDoc.data();
    const currentCount = messageData['associatedThreadId']['count'];

    await updateDoc(messageDoc.ref, {
      associatedThreadId: {
        threadId: currentThreadId,
        count: currentCount + 1,
        lastMessage: new Date(),
      },
    });
  }

  async updateLastMessageDocId(docId: string, chatRef: DocumentReference) {
    await updateDoc(chatRef, {
      lastMessageDocId: docId,
    });
  }

  watchLastMessageDocId(
    chatId: string,
    component: string,
    lastMessageDocId: WritableSignal<string | null>
  ) {
    const chatDocRef = doc(this.getChatCollection(component), chatId);

    onSnapshot(chatDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        const lastMessage = data['lastMessageDocId'] || null;

        if (lastMessageDocId() !== lastMessage) {
          lastMessageDocId.set(lastMessage);
        }
      }
    });
  }

  subscribeFirstThreadMessage(chatId: string, docId: string, component: string) {
    const messagesCollection = this.getSubColMessages(chatId, component);
    const messageDocRef = doc(messagesCollection, docId);

    onSnapshot(messageDocRef, (docSnapshot) => {
      if (docSnapshot.exists()) {        
        this.firstThreadMessage.set(docSnapshot.data() as IncomingMessage);
      }
    });
  }

  setZIndexForNavBarButton(value: boolean) {
    this.indexForNavBarButton.set(value);
  }
}
