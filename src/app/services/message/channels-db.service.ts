import { effect, inject, Injectable, signal } from '@angular/core';
import {
  collection,
  doc,
  Firestore,
  onSnapshot,
  updateDoc,
  arrayUnion,
} from '@angular/fire/firestore';
import { addDoc } from 'firebase/firestore';
import { Channel } from '../../interfaces/channel';
import { SearchDevspaceService } from './search-devspace.service';
import { UserProfile } from '../../interfaces/userProfile';
import { UsersDbService } from '../usersDb/users-db.service';

@Injectable({
  providedIn: 'root',
})
export class ChannelsDbService {
  private channels = inject(Firestore);
  private usersDb = inject(UsersDbService);

  channelSig = signal<Channel | null>(null);
  channelUserDataListSig = signal<UserProfile[]>([]);
  channelListSig = signal<Channel[]>([]);
  unsubChannelList: any;
  private searchAbortController: AbortController | null = null;
  private searchTimeout: any = null;

  constructor(private searchService: SearchDevspaceService) {
    this.subChannelList();
    effect(() => {
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
        this.searchService.searchMessagesInChannels(searchText, 'channels');
      }, 300);
    });
  }

  get channel() {
    return this.channelSig();
  }

  get channelUserDataList() {
    return this.channelUserDataListSig();
  }

  get channelList() {
    return this.channelListSig();
  }

  updateChannel(channel: Partial<Channel>) {
    this.channelSig.update((currentData) => ({ ...currentData!, ...channel }));
  }

  async changeChannel() {
    const channelRef = this.getSingleDocRef('channels', this.channel!.id);
    await updateDoc(channelRef, this.getCleanJson(this.channel!));
  }

  getCleanJson(channel: Channel): {} {
    return {
      id: channel.id,
      name: channel.name,
      description: channel.description,
      createdBy: channel.createdBy,
      participants: channel.participants,
    };
  }

  async addChannel() {
    await addDoc(this.getChannelRef(), this.channelSig()).then(
      async (docRef) => {
        updateDoc(docRef, {
          id: docRef.id,
        });
      }
    );
  }

  setChannelObject(object: any): Channel {
    return {
      id: object.id || '',
      name: object.name || '',
      description: object.description || '',
      createdBy: object.createdBy || {},
      participants: object.participants || {},
    };
  }

  subToChannel(id: string) {
    const channelRef = this.getSingleDocRef('channels', id);
    onSnapshot(channelRef, (docSnapshot) => {
      const channelData = this.setChannelObject(docSnapshot.data());

      this.channelSig.set(channelData);

      this.loadChannelUserDatas(channelData.participants);
    });
  }

  loadChannelUserDatas(participants: { id: string; createdBy: boolean }[]) {
    this.channelUserDataListSig.set([]);

    participants.forEach((participant) => {
      this.usersDb.subUser(participant.id, (updateUser) => {
        const currentList = this.channelUserDataListSig();

        this.channelUserDataListSig.set([updateUser, ...currentList]);
      });
    });
  }

  setUserObject(object: any, id: string): UserProfile {
    return {
      id: id || '',
      userName: object.userName || '',
      email: object.email || '',
      avatar: object.avatar || '',
      active: object.active || false,
      clicked: object.clicked || false,
      directmessagesWith: object.directmessagesWith || [],
    };
  }

  subChannelList() {
    onSnapshot(this.getChannelRef(), (list) => {
      const channels: Channel[] = [];
      list.forEach((item) => {
        channels.push(this.setChannelObject(item.data()));
      });
      this.channelListSig.set(channels);
    });
  }

  getChannelRef() {
    return collection(this.channels, 'channels');
  }

  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.channels, colId), docId);
  }

  async updateParticipiants(
    participants: { id: string; createdBy: boolean }[]
  ) {
    const channelRef = this.getSingleDocRef('channels', this.channel!.id);
    await updateDoc(channelRef, { participants: arrayUnion(...participants) });
  }
}
