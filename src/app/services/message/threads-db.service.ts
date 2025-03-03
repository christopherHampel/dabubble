import { inject, Injectable, signal } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  doc,
  Firestore,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from '@angular/fire/firestore';
import { Message } from '../../interfaces/message';
import { onSnapshot } from 'firebase/firestore';
import { Thread } from '../../interfaces/thread';
import { UsersDbService } from '../usersDb/users-db.service';
import { map, Observable } from 'rxjs';
import { CurrentMessage } from '../../interfaces/current-message';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class ThreadsDbService {
  private threads = inject(Firestore);
  private usersDb = inject(UsersDbService);

  currentThreadId = signal<string>('');
  messageListSig = signal<Message[]>([]);
  threadData = signal<any>(null);
  unsubMessageList: any;

  constructor(private router: Router) {}

  get messageList() {
    return this.messageListSig();
  }

  async addThread(
    thread: any,
    message: Message,
    chatId: string,
    currentMessage: CurrentMessage,
    component: string
  ) {
    const firstThreadMessage = true;
    await addDoc(this.getThredRef(), thread).then(async (docRef) => {
      this.currentThreadId.set(docRef.id);
      this.unsubMessageList = this.subMessageList(docRef.id);
      updateDoc(docRef, {
        docId: docRef.id,
        chatId: chatId,
        currentMessageId: currentMessage.docId,
        text: message.text,
        component: component,
        threadMessageData: {
          chatId: chatId,
          messageId: message.docId
        }
      });
    });
  }

  async addMessageToThread(
    threadId: string,
    message: Message | string,
    firstThreadMessage: boolean
  ) {
    const threadRef = doc(this.getThredRef(), threadId);
    const messageRef = collection(threadRef, 'messages');
    let messageType;
    if (typeof message === 'string') {
      messageType = this.getCleanJsonMessage(
        {
          docId: '',
          associatedThreadId: this.currentThreadId(),
          messageAuthor: {
            name: this.usersDb.currentUser!.userName,
            id: this.usersDb.currentUser!.id,
            avatar: this.usersDb.currentUser!.avatar,
          },
          text: message,
          component: 'threads',
          chatId: this.currentThreadId(),
          firstMessageOfTheDay: false,
          createdAt: serverTimestamp(),
          emojis: [],
        },
        threadId,
        firstThreadMessage
      );
    } else {
      messageType = this.getCleanJsonMessage(
        message,
        threadId,
        firstThreadMessage
      );
    }

    await addDoc(messageRef, messageType).then((docRef) => {
      updateDoc(docRef, {
        docId: docRef.id,
      });
      this.updateLastMessageDocId(docRef.id, threadRef)

    });
  }

  setThreadObject(object: any): Thread {
    return {
      docId: object.docId || '',
      participiants: object.participiants || '',
      participiantsDetails: object.participiantsDetails || {},
      // threadName: object.threadName || ''
    };
  }

  setMessageObject(object: any): Message {
    return {
      docId: object.docId || '',
      associatedThreadId: object.accociatedThreadId || '',
      messageAuthor: object.messageAuthor || {},
      text: object.text || '',
      createdAt: object.createdAt || '',
      firstMessageOfTheDay: object.firstMessageOfTheDay || false,
      emojis: object.emojis || [],
      component: 'threads',
      chatId: object.chatId || '',
    };
  }

  subMessageList(threadId: string) {
    const threadRef = doc(this.getThredRef(), threadId);
    const messageRef = collection(threadRef, 'messages');
    const sortedMessageRef = query(messageRef, orderBy('createdAt', 'asc'));

    return onSnapshot(sortedMessageRef, (list) => {
      const messages: Message[] = [];
      list.forEach((item) => {
        messages.push(this.setMessageObject(item.data()));
      });
      this.messageListSig.set(messages);
    });
  }

  getCleanJsonMessage(
    message: Message,
    threadId: string,
    firstThreadMessage: boolean
  ): {} {
    return {
      docId: '',
      chatId: this.currentThreadId(),
      component: 'threads',
      firstThreadMessage: firstThreadMessage,
      accociatedThreadId: threadId,
      messageAuthor: {
        name: message.messageAuthor.name,
        id: message.messageAuthor.id,
        avatar: message.messageAuthor.avatar,
      },
      text: message.text,
      createdAt: message.createdAt,
      firstMessageOfTheDay: '',
      emojis: message.emojis,
    };
  }

  getThredRef() {
    return collection(this.threads, 'threads');
  }

  getMessagesCount(threadId: string): Observable<string> {
    const messagesCollection = collection(
      this.threads,
      `threads/${threadId}/messages`
    );
    const messagesQuery = query(messagesCollection);

    return collectionData(messagesQuery).pipe(
      map((messages) => {
        const count = messages.length;
        const cleanCount = count - 1;
        if (cleanCount === 0) {
          return '';
        } else if (cleanCount === 1) {
          return '1 Antwort';
        } else {
          return `${cleanCount} Antworten`;
        }
      })
    );
  }

  subscribeToThread(threadId: string) {
    const threadRef = doc(this.getThredRef(), threadId);
    onSnapshot(threadRef, (docSnapshot) => {
      this.threadData.set(docSnapshot.data());
    });
  }

  closeThread() {
    this.currentThreadId.set('');
    this.router.navigate(['/chatroom', { outlets: { thread: null } }]);
  }

  async updateLastMessageDocId(docId: string, chatRef: any) {
    await updateDoc(chatRef, {
      lastMessageDocId: docId,
    });
  }
}