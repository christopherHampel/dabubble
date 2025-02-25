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
    this.channelSig.update((currentData) => ({ ...currentData, ...channel }));
  }


  async changeChannel() {
    const channelRef = this.getSingleDocRef('channels', this.channel.id);
    await updateDoc(channelRef, this.getCleanJson(this.channel));
  }


  getCleanJson(channel: Channel): {} {
    return {
      id: channel.id,
      createdBy: channel.createdBy,
      name: channel.name,
      description: channel.description,
      participants: channel.participants,
      participantsDetails: channel.participantsDetails
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
      createdBy: object.createdBy || '',
      name: object.name || '',
      description: object.description || '',
      participants: object.participants || [],
      participantsDetails: object.participantsDetails || {}
    }
  }


  subToChannel(id: string) {
    const channelRef = doc(this.getChannelRef(), id);
    onSnapshot(channelRef, (docSnapshot) => {
      this.channelSig.set(docSnapshot.data() as Channel);
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