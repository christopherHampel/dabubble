import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatsService } from '../../../services/messages/chats.service';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-direct-message',
  imports: [ CommonModule, FormsModule ],
  templateUrl: './direct-message.component.html',
  styleUrl: './direct-message.component.scss'
})
export class DirectMessageComponent {
  private chatSubscription: Subscription | null = null;

  @Input() message:string = '';

  constructor(private route: ActivatedRoute, public chatService: ChatsService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.chatService.chatId = params.get('id') || undefined;
      if (this.chatService.chatId) {
        this.chatService.getChatData(this.chatService.chatId);
      } else {
        console.error('Keine gültige Chat-ID gefunden!');
      }
    });
  }

  async sendText() {
    await this.chatService.addTextToChat(this.message, this.chatService.chatId!);
    this.message = '';
  }

  deleteMessage(i:number) {
    this.chatService.deleteMessage(i);
  }

  ngOnDestroy() {
    if (this.chatSubscription) {
      this.chatSubscription.unsubscribe();
    }
  }

  messagesAvailable() {
    return !this.chatService.chatData.messages;
  }


}
