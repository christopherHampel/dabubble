import { HostListener, Injectable } from '@angular/core';
import { updateDoc } from 'firebase/firestore';
import { UsersDbService } from '../usersDb/users-db.service';
import { ChatsService } from './chats.service';
import { CurrentMessage } from '../../interfaces/current-message';

@Injectable({
  providedIn: 'root'
})
export class EmojisService {

  customEmojis = ['👍', '😂', '😍', '✅', '🙂'];

  emojiPickerOpen:boolean = false;
  currentMessage!:CurrentMessage;

  constructor(private usersService: UsersDbService, private chatSerive: ChatsService) { }

  async getMessageDocument(chatId: string) {
    const query = await this.chatSerive.getQuerySnapshot(this.currentMessage.docId, chatId);
    return query.docs[0]; // Die erste (und einzige) Nachricht zurückgeben
  }
  
  removeUserExistingReaction(emojis: any[], userId: string) {
    let reactionIndex = emojis.findIndex((e: any) => e.id.includes(userId));
  
    if (reactionIndex !== -1) {
      let existingEmoji = emojis[reactionIndex];
      const userIndex = existingEmoji.id.indexOf(userId);
  
      if (userIndex !== -1) {
        existingEmoji.id.splice(userIndex, 1);
        existingEmoji.name.splice(userIndex, 1);
        existingEmoji.count -= 1;
  
        // Falls das Emoji keine Nutzer mehr hat, aus der Liste entfernen
        if (existingEmoji.count === 0) {
          emojis.splice(reactionIndex, 1);
        }
      }
    }
  }
  
  addUserReaction(emojis: any[], emoji: string, userId: string, userName: string) {
    let existingEmoji = emojis.find((e: any) => e.emoji === emoji);
  
    if (existingEmoji) {
      existingEmoji.id.push(userId);
      existingEmoji.name.push(userName);
      existingEmoji.count += 1;
    } else {
      emojis.push({
        emoji: emoji,
        count: 1,
        id: [userId],
        name: [userName]
      });
    }
  }
  
  async updateMessageEmojis(messageDoc: any, emojis: any[]) {
    await updateDoc(messageDoc.ref, { emojis });
  }
  
  async addEmoji(emoji: string, chatId: string) {
    const messageDoc = await this.getMessageDocument(chatId);
    const messageData = messageDoc.data();
    let emojis = messageData['emojis'] || [];
    this.emojiPickerOpen = false;
    const currentUserId = this.usersService.currentUserSig()?.id;
    const currentUserName = this.usersService.currentUserSig()?.userName;

    if (!currentUserId || !currentUserName) {
      console.error("Fehler: Kein gültiger Benutzer gefunden.");
      return;
    }
  
    this.removeUserExistingReaction(emojis, currentUserId);
    this.addUserReaction(emojis, emoji, currentUserId, currentUserName);
    await this.updateMessageEmojis(messageDoc, emojis);
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

  // @HostListener('document:click', ['$event'])
  // clickOutside() {
  //   if (this.emojiPickerOpen) {
  //     this.emojiPickerOpen = false;
  //   }
  // }
}
