import { inject, Injectable, signal } from '@angular/core';
import { collection, doc, Firestore, onSnapshot, updateDoc } from '@angular/fire/firestore';
import { addDoc } from 'firebase/firestore';
import { Channel } from '../../interfaces/channel';

@Injectable({
  providedIn: 'root'
})
export class ChannelsDbService {
  private channels = inject(Firestore);

  channelSig = signal<Channel>({} as Channel);
  channelListSig = signal<Channel[]>([]);
  channelDataSig = signal<any>(null);
  unsubChannelList: any;

  constructor() {
    this.unsubChannelList = this.subChannelList();
  }


  get channelList() {
    return this.channelListSig();
  }


  get channelData() {
    return this.channelDataSig();
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


  subToChannel(id: string) {
    const channelRef = doc(this.getChannelRef(), id);
    onSnapshot(channelRef, (docSnapshot) => {
      this.channelDataSig.set(docSnapshot.data());
    });
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
