import { inject, Injectable, signal } from '@angular/core';
import { addDoc, collection, collectionData, doc, Firestore, orderBy, query, serverTimestamp, updateDoc } from '@angular/fire/firestore';
import { Message } from '../../interfaces/message';
import { onSnapshot } from 'firebase/firestore';
import { Thread } from '../../interfaces/thread';
import { UsersDbService } from '../usersDb/users-db.service';
import { map, Observable } from 'rxjs';
import { CurrentMessage } from '../../interfaces/current-message';

@Injectable({
  providedIn: 'root'
})
export class ThreadsDbService {
  private threads = inject(Firestore);
  private usersDb = inject(UsersDbService);

  currentThreadId = signal<string>('');
  threadListSig = signal<Thread[]>([]);
  messageListSig = signal<Message[]>([]);
  unsubThreadList: any;
  unsubMessageList: any;

  constructor() {
    this.unsubThreadList = this.subThreadList();
  }

  get threadList() {
    return this.threadListSig();
  }

  get messageList() {
    return this.messageListSig();
  }

  async addThread(thread: any, message: Message, chatId:string, currentMessage: CurrentMessage) {
    await addDoc(this.getThredRef(), thread)
      .then(async (docRef) => {
        await this.addMessageToThread(docRef.id, message);
        this.currentThreadId.set(docRef.id);
        this.unsubMessageList = this.subMessageList(docRef.id);
        updateDoc(docRef, {
          docId: docRef.id,
          chatId: chatId,
          currentMessageId: currentMessage.docId
        });
      });
  }

  async addMessageToThread(threadId: string, message: Message | string) {
    const threadRef = doc(this.getThredRef(), threadId);
    const messageRef = collection(threadRef, 'messages');

    let messageType;
    if (typeof message === 'string') {
      messageType = this.getCleanJsonMessage({
        docId: '',
        associatedThreadId: '',
        messageAuthor: {
          name: this.usersDb.currentUser!.userName,
          id: this.usersDb.currentUser!.id,
          avatar: '',
        },
        text: message,
        firstMessageOfTheDay: false,
        createdAt: serverTimestamp(),
        emojis: [],
      });
    } else {
      console.log(message);
      messageType = this.getCleanJsonMessage(message);
    }

    await addDoc(messageRef, messageType)
      .then((docRef) => {
        updateDoc(docRef, {
          docId: docRef.id
        });
      });
  }

  setThreadObject(object: any): Thread {
    return {
      docId: object.docId || '',
      participiants: object.participiants || '',
      participiantsDetails: object.participiantsDetails || {}
    }
  }

  setMessageObject(object: any): Message {
    return {
      docId: object.docId || '',
      associatedThreadId: object.accociatedThreadId || '',
      messageAuthor: object.messageAuthor || {},
      text: object.text || '',
      createdAt: object.createdAt || '',
      firstMessageOfTheDay: object.firstMessageOfTheDay || false,
      emojis: object.emojis || []
    }
  }

  subThreadList() {
    return onSnapshot(this.getThredRef(), (list) => {
      const threads: Thread[] = [];
      list.forEach((item) => {
        threads.push(this.setThreadObject(item.data()));
      });
      this.threadListSig.set(threads);
    });
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

  getCleanJsonMessage(message: Message): {} {
    return {
      docId: '',
      accociatedThreadId: '',
      messageAuthor: {
        name: message.messageAuthor.name,
        id: message.messageAuthor.id,
        avatar: '',
      },
      text: message.text,
      createdAt: message.createdAt,
      firstMessageOfTheDay: '',
      emojis: message.emojis
    }
  }

  getThredRef() {
    return collection(this.threads, 'threads');
  }

  getMessagesCount(threadId: string): Observable<string> {
    const messagesCollection = collection(this.threads, `threads/${threadId}/messages`);
    const messagesQuery = query(messagesCollection);

    return collectionData(messagesQuery).pipe(
      map(messages => {
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
}
