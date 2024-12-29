import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatsService } from '../../services/message/chats.service';

@Component({
  selector: 'app-textarea',
  imports: [ FormsModule ],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.scss'
})
export class TextareaComponent {

  @Input() message:string = '';
  @Input() chatData:any;

  constructor(public chatService: ChatsService) {  }

  async sendText() {
    if(this.message.length > 0) {
      await this.chatService.addTextToChat(this.message, this.chatService.chatId!);
      this.message = '';
    }
  }
}
