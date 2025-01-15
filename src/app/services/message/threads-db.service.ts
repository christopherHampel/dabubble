import { inject, Injectable, signal } from '@angular/core';
import { addDoc, collection, doc, Firestore, setDoc, updateDoc } from '@angular/fire/firestore';
import { Message } from '../../interfaces/message';
import { emojis } from '@ctrl/ngx-emoji-mart/ngx-emoji';
import { onSnapshot } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class ThreadsDbService {
  private threads = inject(Firestore);

  currentThreadId = signal<string>('');
  messageListSig = signal<Message[]>([]);
  unsubMessageList: any;

  constructor() {
    this.unsubMessageList = this.subMessageList();
  }

  async addThread(thread: any, message: Message) {
    await addDoc(this.getUserRef(), thread)
      .then(async (docRef) => {
        console.log('Add thread: ', docRef.id)
        await this.addMessageToThread(docRef.id, message);
        this.currentThreadId.set(docRef.id);
      });
  }


  async addMessageToThread(threadId: string, message: Message) {
    const threadRef = doc(this.getUserRef(), threadId);
    const messageRef = collection(threadRef, 'messages');

    await addDoc(messageRef, this.getCleanJsonMessage(message))
      .then((docRef) => {
        updateDoc(docRef, {
          docId: docRef.id
        });
      });
  }



  setMessageObject(object: any): Message {
    return {
      docId: object.docId || '',
      messageAuthor: {
        name: object.messageAuthor.name || '',
        id: object.messageAuthor.id || ''
      },
      text: object.text || '',
      createdAt: object.createdAt || '',
      emojis: object.emojis || []
    }
  }


  subMessageList() {
    const threadRef = doc(this.getUserRef(), 's51Gpx9GfpsBwz13Rtbp');
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


  getUserRef() {
    return collection(this.threads, 'threads');
  }
}
