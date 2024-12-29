import { Component, Input } from '@angular/core';
import { ChatsService } from '../../../services/message/chats.service';
import { CommonModule } from '@angular/common';
import { CurrentMessage } from '../../../interfaces/current-message';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-single-message',
  imports: [ CommonModule, FormsModule ],
  templateUrl: './single-message.component.html',
  styleUrl: './single-message.component.scss'
})
export class SingleMessageComponent {

  @Input() currentMessage!:CurrentMessage;
  isEditing: boolean = false;
  @Input() editedText: string = '';

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
}

