import { inject, Injectable, signal } from '@angular/core';
import { addDoc, collection, doc, Firestore, setDoc, updateDoc } from '@angular/fire/firestore';
import { Message } from '../../interfaces/message';
import { emojis } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { onSnapshot } from 'firebase/firestore';
import { Thread } from '../../interfaces/thread';

@Injectable({
  providedIn: 'root'
})
export class ThreadsDbService {
  private threads = inject(Firestore);

  currentThreadId = signal<string>('');
  threadListSig = signal<Thread []>([]);
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
      });
  }


  async addMessageToThread(threadId: string, message: Message | string) {
    const threadRef = doc(this.getThredRef(), threadId);
    const messageRef = collection(threadRef, 'messages');

    let messageType;
    if (typeof message === 'string') {
      messageType = { 
        text: message
      };
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



  setThreadObject(object: any): Thread {
    return {
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
      console.log('Thread list: ', this.threadListSig());
    });
  }


  subMessageList(threadId: string) {
    const threadRef = doc(this.getThredRef(), threadId);
    const messageRef = collection(threadRef, 'messages');

    return onSnapshot(messageRef, (list) => {
      const messages: Message[] = [];
      list.forEach((item) => {
        messages.push(this.setMessageObject(item.data()));
      });
      this.messageListSig.set(messages);
      console.log(messages);
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
