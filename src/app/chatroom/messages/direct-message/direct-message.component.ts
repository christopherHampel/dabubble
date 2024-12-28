import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatsService } from '../../../services/messages/chats.service';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TextareaComponent } from '../../../shared/textarea/textarea.component';
import { SingleMessageComponent } from '../single-message/single-message.component';

@Component({
  selector: 'app-direct-message',
  imports: [ CommonModule, FormsModule, TextareaComponent, SingleMessageComponent ],
  templateUrl: './direct-message.component.html',
  styleUrl: './direct-message.component.scss'
})
export class DirectMessageComponent {
  private chatSubscription: Subscription | null = null;

  chatData: any = null; // Lokale Variable für Chat-Daten


  // @Input() message:string = '';

  constructor(private route: ActivatedRoute, public chatService: ChatsService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.chatService.chatId = params.get('id') || undefined;

      if (this.chatService.chatId) {
        // Starte das Abrufen der Chat-Daten
        this.chatService.getChatData(this.chatService.chatId);

        // Abonniere die Chat-Daten
        this.chatSubscription = this.chatService.chatData$.subscribe((data) => {
          this.chatData = data;
        });
      } else {
        console.error('Keine gültige Chat-ID gefunden!');
      }
    });
  }

  trackByMessageId(index: number, message: { id: number }): number {
    return message.id;
  }  

  deleteMessage(i:number) {
    this.chatService.deleteMessage(i);
  }

  ngOnDestroy() {
    if (this.chatSubscription) {
      this.chatSubscription.unsubscribe();
    }
  }

  messagesAvailable(): boolean {
    return this.chatData?.messages?.length > 0;
  }
}
