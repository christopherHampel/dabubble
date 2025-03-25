import { inject, Injectable, signal } from '@angular/core';
import { Channel } from '../../interfaces/channel';
import { collection, doc, Firestore, getDoc, getDocs } from '@angular/fire/firestore';
import { CurrentMessage } from '../../interfaces/current-message';
import { Message } from '../../interfaces/message';

@Injectable({
  providedIn: 'root',
})
export class SearchDevspaceService {
  private firestore = inject(Firestore);

  searchTextSig = signal<string>('');
  filteredChannelsSig = signal<Channel[]>([]);
  isLoading = signal<boolean>(false);

  results: any[] = [];

  constructor() {}

  setSearchText(text: string) {
    this.searchTextSig.set(text);
  }

  async searchMessagesInChannels(searchText: string, component: string) {
    this.isLoading.set(true);
    this.results = [];
  
    const channels = await this.getChannels(component);
  
    for (const channelDoc of channels) {
      const messages = await this.getMessages(component, channelDoc.id);
      this.filterAndStoreResults(messages, searchText);
    }
    this.isLoading.set(false);
  }
  
  private async getChannels(component: string) {
    const channelsRef = collection(this.firestore, component);
    const channelsSnapshot = await getDocs(channelsRef);
    return channelsSnapshot.docs;
  }
  
  private async getMessages(component: string, channelId: string) {
    const messagesRef = collection(this.firestore, `${component}/${channelId}/messages`);
    const messagesSnapshot = await getDocs(messagesRef);
    return messagesSnapshot.docs.map((doc) => doc.data());
  }
  
  private filterAndStoreResults(messages: any[], searchText: string) {
    const searchLower = searchText.toLowerCase();
  
    for (const messageData of messages) {
      if (typeof messageData['text'] === 'string') {
        const messageText = messageData['text'].toLowerCase();
  
        if (messageText.includes(searchLower)) {
          const searchResult = this.returnSearchResult(messageData as CurrentMessage);
          this.results.push({ searchResult });
        }
      }
    }
  }
  
  returnSearchResult(messageData:CurrentMessage) {
    
    return {
      channelId: messageData['chatId'],
      messageId: messageData['docId'],
      component: messageData['component'],
      text: messageData['text'],
      chatPartner: messageData.chatPartner,
      originalChatInfo: messageData.originalChatInfo || {},
    }
  }

  async getThreadData(result:any) {
    const threadRef = doc(this.firestore, 'threads', result.channelId);
    const docSnap = await getDoc(threadRef);

    if (docSnap.exists()) {
      const chatId = docSnap.data()['chatId'];
      const text = docSnap.data()['text'];
      return {
        chatId: chatId,
        text: text
      };
    } else {
      return {
        chatId: '',
        text: ''
      }
    }
  }
}
