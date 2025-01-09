import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChatsService } from '../../../services/message/chats.service';
import { TextareaComponent } from '../../../shared/textarea/textarea.component';
import { SingleMessageComponent } from '../single-message/single-message.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-direct-message',
  imports: [ CommonModule, FormsModule, TextareaComponent, SingleMessageComponent],
  templateUrl: './direct-message.component.html',
  styleUrl: './direct-message.component.scss',
})
export class DirectMessageComponent {

  chatId!: string;
  chatMessages$!: Observable<any[]>;

  constructor(private route: ActivatedRoute, public chatService: ChatsService) { }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.chatId = params.get('id')!;
      this.chatService.getChatInformationen(this.chatId);
      this.chatMessages$ = this.chatService.messages$;
    });
  }

  checkDate() {
  //   const lastMessageIndex = this.chatData.messages.length - 1;
  //   const lastMessageDate = this.chatData.messages[lastMessageIndex].createdAt;

  //   if (!lastMessageDate) {
  //     return 'Ungültiges Datum';
  //   }
    
  //   const date = lastMessageDate.toDate();
  //   const currentDate = new Date();

  //   const dateFormat = {
  //     weekday: 'long',
  //     day: '2-digit',
  //     month: '2-digit',
  //     year: 'numeric',
  //   };

  //   const isSameDate =
  //   date.getFullYear() === currentDate.getFullYear() &&
  //   date.getMonth() === currentDate.getMonth() &&
  //   date.getDate() === currentDate.getDate();

  //   if(isSameDate) {
  //     return 'Heute';
  //   } else {
  //     return date.toLocaleDateString('de-DE', dateFormat);
  //   }
  // }  
  }
}