import { inject, Injectable, signal } from '@angular/core';
import { addDoc, collection, doc, Firestore, orderBy, query, serverTimestamp, setDoc, updateDoc } from '@angular/fire/firestore';
import { Message } from '../../interfaces/message';
import { onSnapshot } from 'firebase/firestore';
import { Thread } from '../../interfaces/thread';
import { UsersDbService } from '../usersDb/users-db.service';

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

  async addThread(thread: any, message: Message) {
    await addDoc(this.getThredRef(), thread)
      .then(async (docRef) => {
        await this.addMessageToThread(docRef.id, message);
        this.currentThreadId.set(docRef.id);
        this.unsubMessageList = this.subMessageList(docRef.id);
        updateDoc(docRef, {
          docId: docRef.id
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
        messageAuthor: {
          name: this.usersDb.currentUser!.userName,
          id: this.usersDb.currentUser!.id
        },
        text: message,
        createdAt: serverTimestamp(),
        emojis: []
      });
    } else {
      messageType = this.getCleanJsonMessage(message);
    }

    await addDoc(messageRef, messageType)
      .then((docRef) => {
        updateDoc(docRef, {
          docId: docRef.id
        });
      });
  }


  setCurrentThreadId(message: any) {
    const currentThread = this.threadList.find(thread => thread.belongsToMessage === message.docId);
    if (currentThread) {
      this.currentThreadId.set(currentThread.docId);
    }
    return currentThread;
  }



  setThreadObject(object: any): Thread {
    return {
      docId: object.docId || '',
      participiants: object.participiants || '',
      belongsToMessage: object.belongsToMessage || '',
      participiantsDetails: object.participiantsDetails || {}
    }
  }



  setMessageObject(object: any): Message {
    return {
      docId: object.docId || '',
      messageAuthor: object.messageAuthor || {},
      text: object.text || '',
      createdAt: object.createdAt || '',
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
      messageAuthor: {
        name: message.messageAuthor.name,
        id: message.messageAuthor.id
      },
      text: message.text,
      createdAt: message.createdAt,
      emojis: message.emojis
    }
  }


  getThredRef() {
    return collection(this.threads, 'threads');
  }
}
