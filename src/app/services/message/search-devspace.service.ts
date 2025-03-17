import { inject, Injectable, signal } from '@angular/core';
import { Channel } from '../../interfaces/channel';
import { collection, doc, Firestore, getDoc, getDocs } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class SearchDevspaceService {
  private firestore = inject(Firestore);

  searchTextSig = signal<string>('');
  filteredChannelsSig = signal<Channel[]>([]);
  results: any[] = [];

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
        console.log(messageData);
        
        
        if (typeof messageData['text'] === 'string') {
          const messageText = messageData['text'].toLowerCase();
          const searchLower = searchText.toLowerCase();

          if (messageText.includes(searchLower)) {
            this.results.push({
              channelId: channelDoc.id,
              messageId: messageDoc.id,
              component: messageData['component'],
              text: messageData['text'],
              originalChat: messageData['originalChat'],
              originalChatId: messageData['originalChatId'],
            });
          }
        }
      });
    }
    // console.log('Suchergebnisse:', this.results);
  }

  async getThreadData(result:any) {
    const threadRef = doc(this.firestore, 'threads', result.channelId);
    const docSnap = await getDoc(threadRef);

    if (docSnap.exists()) {
      const chatId = docSnap.data()['chatId'];
      return chatId;
    } else {
      return 'No Data'
    }
  }
}
