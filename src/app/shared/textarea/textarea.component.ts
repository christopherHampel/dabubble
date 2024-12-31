import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatsService } from '../../services/message/chats.service';
import { CurrentMessage } from '../../interfaces/current-message';
import { EmojiPickerComponentComponent } from './emoji-picker-component/emoji-picker-component.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-textarea',
  imports: [ FormsModule, EmojiPickerComponentComponent, CommonModule ],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.scss'
})
export class TextareaComponent {

  @Input() message:string = '';
  @Input() chatData!:{ participant:string };

  emojiMartOpen:boolean = false;

  constructor(public chatService: ChatsService) {  }

  async sendText() {
    if(this.message.length > 0) {
      await this.chatService.addTextToChat(this.message, this.chatService.chatId!);
      this.message = '';
    }
  }

  autoGrowTextZone(e:any) {
    e.target.style.height = "25px";
    e.target.style.height = (e.target.scrollHeight + 25)+"px";
  }

  toggleEmoji() {
    this.emojiMartOpen = !this.emojiMartOpen;
  }

  addEmojiToMessage(emoji: string) {
    this.message += emoji;
  }
}
