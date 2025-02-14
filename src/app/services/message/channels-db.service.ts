import { inject, Injectable, signal } from '@angular/core';
import { collection, Firestore, updateDoc } from '@angular/fire/firestore';
import { addDoc } from 'firebase/firestore';
import { Channel } from '../../interfaces/channel';

@Injectable({
  providedIn: 'root'
})
export class ChannelsDbService {
  private channels = inject(Firestore);

  channelSig = signal<Channel>({} as Channel);

  constructor() { }

  updateChannel(channel: Partial<Channel>) {
    this.channelSig.update((currentData) => ({...currentData, ...channel}));
  }

  async addChannel() {
    await addDoc(this.getChannelRef(), this.channelSig())
      .then(async (docRef) => {
        updateDoc(docRef, {
          id: docRef.id
        });
      });
  }

  getChannelRef() {
    return collection(this.channels, 'channels');
  }
}
