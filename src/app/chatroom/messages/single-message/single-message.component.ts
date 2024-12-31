import { Component, Input } from '@angular/core';
import { ChatsService } from '../../../services/message/chats.service';
import { CommonModule } from '@angular/common';
import { CurrentMessage } from '../../../interfaces/current-message';
import { FormsModule } from '@angular/forms';
import { HostListener } from '@angular/core';
import { EmojiPickerComponentComponent } from '../../../shared/textarea/emoji-picker-component/emoji-picker-component.component';

@Component({
  selector: 'app-single-message',
  imports: [ CommonModule, FormsModule, EmojiPickerComponentComponent ],
  templateUrl: './single-message.component.html',
  styleUrl: './single-message.component.scss'
})
export class SingleMessageComponent {

  @Input() currentMessage!:CurrentMessage;
  @Input() editedText: string = '';

  isEditing: boolean = false;
  emojiMartOpen:boolean = false;

  constructor(private chatService: ChatsService) {}

  deleteMessage() {
    // this.chatService.deleteMessage(this.index);
  }

  editMessage() {
    this.isEditing = true;
  }

  updateMessage(currentMessage:CurrentMessage) {
    this.isEditing = false;
    const messageTimestamp = currentMessage.createdAt;
    this.chatService.updateMessage(messageTimestamp, this.currentMessage.text);
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
    console.log(this.emojiMartOpen);
  }

  autoGrowTextZone(e:any) {
    e.target.style.height = "25px";
    e.target.style.height = (e.target.scrollHeight + 25)+"px";
  }
}