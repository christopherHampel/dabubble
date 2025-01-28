import { CommonModule } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ChatsService } from '../../../services/message/chats.service';
import { TextareaComponent } from '../../../shared/textarea/textarea.component';
import { SingleMessageComponent } from '../single-message/single-message.component';
import { Observable } from 'rxjs';
import { EmojiPickerComponentComponent } from '../../../shared/textarea/emoji-picker-component/emoji-picker-component.component';
import { EmojiService } from '../../../services/message/emoji.service';

@Component({
  selector: 'app-direct-message',
  imports: [ CommonModule, FormsModule, TextareaComponent, SingleMessageComponent, EmojiPickerComponentComponent ],
  templateUrl: './direct-message.component.html',
  styleUrl: './direct-message.component.scss',
})
export class DirectMessageComponent {
  @ViewChild('messageBody') messageBody!: ElementRef;

  chatId!: string;
  chatMessages$!: Observable<any[]>;

  emojiService = inject(EmojiService);

  constructor(private route: ActivatedRoute, public chatService: ChatsService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.chatId = params.get('id')!;
      this.chatService.getChatInformationen(this.chatId);
      this.chatMessages$ = this.chatService.messages$;
      // console.log('Messages: ', this.chatMessages$);
      this.chatMessages$.subscribe(() => {
        this.scrollToBottom();
      });
    });
  }

  private scrollToBottom(): void {
    if (this.messageBody) {
      const messageBodyElement = this.messageBody.nativeElement;
      messageBodyElement.scrollTop = messageBodyElement.scrollHeight;
    }
  }

  newDate(message:any) {
    const rawTimestamp = message.createdAt;

    if (rawTimestamp && typeof rawTimestamp.toMillis === "function") {
        const timestampInMs = rawTimestamp.toMillis();
        const messageDate = new Date(timestampInMs).toLocaleDateString("de-DE");

        console.log("Datum der Nachricht ist:", messageDate);
        return true;
    } else {
      return false;
    };
  }

  addEmoji(event:string) {
    this.emojiService.addEmoji(event, this.chatId)
  }
}