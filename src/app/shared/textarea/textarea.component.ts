import { Component, inject, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatsService } from '../../services/message/chats.service';
import { CurrentMessage } from '../../interfaces/current-message';
import { EmojiPickerComponentComponent } from './emoji-picker-component/emoji-picker-component.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ThreadsDbService } from '../../services/message/threads-db.service';

@Component({
  selector: 'app-textarea',
  imports: [FormsModule, EmojiPickerComponentComponent, CommonModule],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.scss'
})
export class TextareaComponent implements OnInit {
  private threadDb = inject(ThreadsDbService);

  @Input() message: string = '';
  @Input() chatPartnerName!: string;
  @Input() component: 'chat' | 'thread' = 'chat';
  @Input() id: string = '';

  chatId: string = '';

  emojiMartOpen: boolean = false;

  constructor(public chatService: ChatsService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.chatId = params.get('id')!;
    })
  }

  async sendText() {
    if (this.message.length > 0) {
      if (this.component == 'chat') {
        await this.chatService.addMessageToChat(this.message, this.chatId);
      } else if (this.component == 'thread') {
        await this.threadDb.addMessageToThread(this.threadDb.currentThreadId(), this.message);
      }
      this.message = '';
    }
  }

  autoGrowTextZone(e: any) {
    e.target.style.height = "25px";
    e.target.style.height = (e.target.scrollHeight + 25) + "px";
  }

  closeEmojiPicker() {
    if(this.emojiMartOpen) {
      this.emojiMartOpen = !this.emojiMartOpen;
    }
  }

  toggleEmoji() {
    this.emojiMartOpen = !this.emojiMartOpen;
  }

  preventClose(event: MouseEvent): void {
    event.stopPropagation();
  }

  addEmojiToMessage(emoji: string) {
    this.message += emoji;
  }
}
