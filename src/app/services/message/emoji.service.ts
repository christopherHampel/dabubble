import { Injectable } from '@angular/core';
import { updateDoc } from 'firebase/firestore';
import { UsersDbService } from '../usersDb/users-db.service';
import { ChatsService } from './chats.service';
import { CurrentMessage } from '../../interfaces/current-message';

@Injectable({
  providedIn: 'root'
})
export class EmojiService {

  customEmojis = ['👍', '😂', '😍', '✅'];

  emojiPickerOpen:boolean = false;
  currentMessage!:CurrentMessage;

  constructor(private usersService: UsersDbService, private chatSerive: ChatsService) { }

  async addEmoji(emoji: string, chatId: string) {
    const query = await this.chatSerive.getQuerySnapshot(this.currentMessage.docId, chatId);
    const messageDoc = query.docs[0];
    const messageData = messageDoc.data();
    const emojis = messageData['emojis'] || [];
    
    const currentUserId = this.usersService.currentUserSig()?.id;
    const currentUserName = this.usersService.currentUserSig()?.userName;
  
    const existingEmoji = emojis.find((e: any) => e.emoji === emoji);
    
    if (existingEmoji) {
      if (!existingEmoji.id.includes(currentUserId)) {
        existingEmoji.count += 1;
        existingEmoji.id.push(currentUserId);
        existingEmoji.name.push(currentUserName);
      }
    } else {
      const emojiPackage = {
        emoji: emoji,
        count: 1,
        id: [currentUserId],
        name: [currentUserName]
      };
      emojis.push(emojiPackage);
    }
  
    await updateDoc(messageDoc.ref, { emojis });
  }
}
