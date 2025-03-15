import { inject, Injectable, signal } from '@angular/core';
import { Channel } from '../../interfaces/channel';
import { collection, doc, Firestore, getDoc, getDocs } from '@angular/fire/firestore';
import { CurrentMessage } from '../../interfaces/current-message';
import { Message } from '../../interfaces/message';
import { Thread } from '../../interfaces/thread';
@Injectable({
  providedIn: 'root',
})
export class SearchDevspaceService {
  private firestore = inject(Firestore);

  searchTextSig = signal<string>('');
  filteredChannelsSig = signal<Channel[]>([]);
  results: any[] = [];
  // channels: any[] = [];
  // messages: any[] = [];

  constructor() {}

  setSearchText(text: string) {
    this.searchTextSig.set(text);
  }

  async searchMessagesInChannels(searchText: string, component: string) {
    const channelsRef = collection(this.firestore, component);
    const channelsSnapshot = await getDocs(channelsRef);

    this.results = [];

    for (const channelDoc of channelsSnapshot.docs) {
      const messagesRef = collection(
        this.firestore,
        `${component}/${channelDoc.id}/messages`
      );
      const messagesSnapshot = await getDocs(messagesRef);

      messagesSnapshot.forEach((messageDoc) => {
        const messageData = messageDoc.data();

        if (typeof messageData['text'] === 'string') {
          const messageText = messageData['text'].toLowerCase();
          const searchLower = searchText.toLowerCase();

          if (messageText.includes(searchLower)) {
            // console.log('Message:', messageData);

            this.results.push({
              channelId: channelDoc.id,
              messageId: messageDoc.id,
              component: messageData['component'],
              text: messageData['text'],
            });
          }
        }

        if (messageData['component'] === 'threads') {
          this.getThreadData(channelDoc.id);
        }
      });
    }
    // console.log('Suchergebnisse:', this.results);
  }

  async getThreadData(docId:string) {
    const threadRef = doc(this.firestore, 'threads', docId);
    const docSnap = await getDoc(threadRef);
    
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
    } else {
      console.log("No Thread Data");
    }
  }
}
