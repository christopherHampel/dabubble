import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ChatsService } from '../../../services/message/chats.service';
import { TextareaComponent } from '../../../shared/textarea/textarea.component';
import { SingleMessageComponent } from '../single-message/single-message.component';

@Component({
  selector: 'app-direct-message',
  imports: [ CommonModule, FormsModule, TextareaComponent, SingleMessageComponent],
  templateUrl: './direct-message.component.html',
  styleUrl: './direct-message.component.scss',
})
export class DirectMessageComponent {
  private chatSubscription: Subscription | null = null;

  chatData: any = null;

  constructor(private route: ActivatedRoute, public chatService: ChatsService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.chatService.chatId = params.get('id') || undefined;

      if (this.chatService.chatId) {
        this.chatService.getMessageData(this.chatService.chatId);
        this.chatSubscription = this.chatService.chatData$.subscribe((data) => {
          this.chatData = data;
          // console.log(this.chatData.messages);
        });
      } else {
        console.error('Keine gültige Chat-ID gefunden!');
      }
    });
  }

  trackByMessageId(index: number, message: { id: number }): number {
    return message.id;
  }  

  deleteMessage() {
    // this.chatService.deleteMessage();
  }

  ngOnDestroy() {
    if (this.chatSubscription) {
      this.chatSubscription.unsubscribe();
    }
  }

  messagesAvailable(): boolean {
    return this.chatData?.messages?.length > 0;
  }

  checkDate() {
    const lastMessageIndex = this.chatData.messages.length - 1;
    const lastMessageDate = this.chatData.messages[lastMessageIndex].createdAt;

    if (!lastMessageDate) {
      return 'Ungültiges Datum';
    }
    
    const date = lastMessageDate.toDate();
    const currentDate = new Date();

    const dateFormat = {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    };

    const isSameDate =
    date.getFullYear() === currentDate.getFullYear() &&
    date.getMonth() === currentDate.getMonth() &&
    date.getDate() === currentDate.getDate();

    if(isSameDate) {
      return 'Heute';
    } else {
      return date.toLocaleDateString('de-DE', dateFormat);
    }
  }
}
