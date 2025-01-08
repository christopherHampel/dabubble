import { Component, Input, OnInit } from '@angular/core';
import { ChatsService } from '../../../services/message/chats.service';
import { CommonModule } from '@angular/common';
import { CurrentMessage } from '../../../interfaces/current-message';
import { FormsModule } from '@angular/forms';
import { EmojiPickerComponentComponent } from '../../../shared/textarea/emoji-picker-component/emoji-picker-component.component';
import { TooltipComponent } from './tooltip/tooltip.component';
import { UsersDbService } from '../../../services/usersDb/users-db.service';

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

  isEditing: boolean = false;
  emojiMartOpen:boolean = false;

  constructor(private chatService: ChatsService, public usersService: UsersDbService) { }

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
    const messageTimestamp = currentMessage.createdAt;
    this.chatService.addEmoji(messageTimestamp, emoji);
  }

  increaseValueOfEmojii(emoji:string) {
    this.chatService.increaseValueOfEmoji(emoji, this.currentMessage)
  }

  getUser() {
    if(this.isMessageFromCurrentUser()) {
      return 'own-message'
    } else {
      return 'other-message'
    }
  }

  isMessageFromCurrentUser() {
    return this.currentMessage.uid == this.usersService.currentUserSig()?.userName;
  }
}