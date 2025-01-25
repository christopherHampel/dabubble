import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ChatsService } from '../../../services/message/chats.service';
import { CommonModule } from '@angular/common';
import { CurrentMessage } from '../../../interfaces/current-message';
import { FormsModule } from '@angular/forms';
import { EmojiPickerComponentComponent } from '../../../shared/textarea/emoji-picker-component/emoji-picker-component.component';
import { TooltipComponent } from './tooltip/tooltip.component';
import { UsersDbService } from '../../../services/usersDb/users-db.service';
import { Timestamp } from 'firebase/firestore';

@Component({
  selector: 'app-single-message',
  imports: [ CommonModule, 
    FormsModule, 
    EmojiPickerComponentComponent, 
    TooltipComponent ],
  templateUrl: './single-message.component.html',
  styleUrl: './single-message.component.scss'
})
export class SingleMessageComponent implements OnInit {

  @Input() currentMessage!:any;
  @Input() editedText!: string;
  @Input() chatId!: string;
  @Input() component: 'chat' | 'thread' = 'chat';

  isEditing: boolean = false;
  emojiMartOpen:boolean = false;

  constructor(public chatService: ChatsService, public usersService: UsersDbService) { }

  ngOnInit(): void {
    console.log('CurrentMessage is:', this.currentMessage);
  }

  deleteMessage() {
    // this.chatService.deleteMessage(this.index);
  }

  onIsEditingChange(newValue: boolean) {
    this.isEditing = newValue;
  }

  updateMessage(currentMessage:CurrentMessage) {
    this.isEditing = false;
    const docId = currentMessage.docId;
    this.chatService.updateMessage(docId, this.currentMessage.text, this.chatId);
  }

  cancelEdit() {
    this.isEditing = false;
  }

  getTime(): string | null {
    if (!this.currentMessage?.createdAt) return null;
    const messageTime = this.currentMessage.createdAt.toDate();
    return messageTime.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  toggleEmoji() {
    this.emojiMartOpen = !this.emojiMartOpen;
  }

  autoGrowTextZone(e:any) {
    e.target.style.height = "25px";
    e.target.style.height = (e.target.scrollHeight + 25)+"px";
  }

  addEmoji(event:string) {

  }

  addEmojiToMessage(emoji:string, currentMessage:CurrentMessage) {
    // console.log('Single message component: ', this.component);
    this.chatService.component.set(this.component);
    this.chatService.addEmoji(currentMessage, emoji, this.chatId);
  }

  increaseValueOfEmojii(emoji:string) {
    // this.chatService.increaseValueOfEmoji(emoji, this.currentMessage)
  }

  getUser() {
    if(this.isMessageFromCurrentUser()) {
      return 'own-message'
    } else {
      return 'other-message'
    }
  }

  isMessageFromCurrentUser() {
    return this.currentMessage.messageAuthor.id == this.usersService.currentUserSig()?.id;
  }

  showDate() {
    const rawTimestamp = this.currentMessage.createdAt;
  
    if (rawTimestamp && typeof rawTimestamp.toMillis === "function") {
      const timestampInMs = rawTimestamp.toMillis();
      const date = new Date(timestampInMs);
      const messageDate = this.checkTodayYesterday(date);
      return messageDate;
    } else {
      return 'No Current Date available.';
    }
  }
  

  checkTodayYesterday(timestamp: Date | Timestamp): string {
    const date = timestamp instanceof Date ? timestamp : timestamp.toDate();
  
    const now = new Date();
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
  
    const inputDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
  
    if (inputDate.getTime() === today.getTime()) {
      return "Heute";
    } else if (inputDate.getTime() === yesterdayStart.getTime()) {
      return "Gestern";
    }

    const day = String(inputDate.getDate()).padStart(2, '0');
    const month = String(inputDate.getMonth() + 1).padStart(2, '0');
    const year = inputDate.getFullYear();
    return `${day}.${month}.${year}`;
  }
  
}