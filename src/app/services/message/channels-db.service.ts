import { inject, Injectable, signal } from '@angular/core';
import { collection, Firestore, onSnapshot, updateDoc } from '@angular/fire/firestore';
import { addDoc } from 'firebase/firestore';
import { Channel } from '../../interfaces/channel';

@Injectable({
  providedIn: 'root'
})
export class ChannelsDbService {
  private channels = inject(Firestore);

  channelSig = signal<Channel>({} as Channel);
  channelListSig = signal<Channel[]>([]);
  unsubChannelList: any;

  constructor() {
    this.unsubChannelList = this.subChannelList();
  }


  get channelList() {
    return this.channelListSig();
  }


  updateChannel(channel: Partial<Channel>) {
    this.channelSig.update((currentData) => ({ ...currentData, ...channel }));
  }


  async addChannel() {
    await addDoc(this.getChannelRef(), this.channelSig())
      .then(async (docRef) => {
        updateDoc(docRef, {
          id: docRef.id
        });
      });
  }


  setChannelObject(object: any): Channel {
    return {
      id: object.id || '',
      name: object.name || '',
      description: object.description || '',
      participants: object.participants || [],
      participantsDetails: object.participantsDetails || {}
    }
  }


  subChannelList() {
    return onSnapshot(this.getChannelRef(), (list) => {
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
}
