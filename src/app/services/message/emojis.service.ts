import { Injectable } from '@angular/core';
import { updateDoc } from 'firebase/firestore';
import { UsersDbService } from '../usersDb/users-db.service';
import { ChatsService } from './chats.service';
import { CurrentMessage } from '../../interfaces/current-message';

@Injectable({
  providedIn: 'root'
})
export class EmojisService {


  customEmojis = ['👍', '😂', '😍', '✅', '🙂'];
  // customEmojis: string[] = [];

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

  loadFrequentlyUsedEmojis() {
    const frequentlyUsed = JSON.parse(localStorage.getItem('emoji-mart.frequently') || '{}');
    const sortedEmojis = Object.keys(frequentlyUsed)
      .sort((a, b) => frequentlyUsed[b] - frequentlyUsed[a]) // Sortiere nach Nutzungshäufigkeit
      .slice(0, 5); // Nimm die obersten 5

    // Emoji-Namen in Unicode Emojis umwandeln
    this.customEmojis = sortedEmojis.length ? sortedEmojis : ['smile', 'heart_eyes', 'thumbsup']; // Fallback
    console.log(this.customEmojis)
  }
}
