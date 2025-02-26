import { inject, Injectable, signal } from '@angular/core';
import { collection, doc, Firestore, onSnapshot, updateDoc } from '@angular/fire/firestore';
import { addDoc } from 'firebase/firestore';
import { Channel } from '../../interfaces/channel';

@Injectable({
  providedIn: 'root'
})
export class ChannelsDbService {
  private channels = inject(Firestore);

  channelSig = signal<Channel | null>(null);
  channelListSig = signal<Channel[]>([]);
  unsubChannelList: any;

  constructor() {
    this.unsubChannelList = this.subChannelList();
  }


  get channel() {
    return this.channelSig();
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
      participants: channel.participants
    }
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
      createdBy: object.createdBy || {},
      participants: object.participants || {}
    }
  }


  subToChannel(id: string) {
    const channelRef = this.getSingleDocRef('channels', id);
    onSnapshot(channelRef, (docSnapshot) => {
      this.channelSig.set(this.setChannelObject(docSnapshot.data()));
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


  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.channels, colId), docId);
  }
}