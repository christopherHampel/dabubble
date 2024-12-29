import { Component, Input } from '@angular/core';
import { ChatsService } from '../../../services/message/chats.service';
import { CommonModule } from '@angular/common';
import { CurrentMessage } from '../../../interfaces/current-message';

@Component({
  selector: 'app-single-message',
  imports: [ CommonModule ],
  templateUrl: './single-message.component.html',
  styleUrl: './single-message.component.scss'
})
export class SingleMessageComponent {

  @Input() currentMessage!:CurrentMessage;
  // @Input() index!:number;

  constructor(private chatService: ChatsService) {}

  deleteMessage() {
    // this.chatService.deleteMessage(this.index);
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

