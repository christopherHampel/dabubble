import { Component, Input } from '@angular/core';
import { ChatsService } from '../../../services/messages/chats.service';

@Component({
  selector: 'app-single-message',
  imports: [ ],
  templateUrl: './single-message.component.html',
  styleUrl: './single-message.component.scss'
})
export class SingleMessageComponent {

  @Input() currentMessage!:{text:string}
  @Input() index!:number;

  constructor(private chatService: ChatsService) {}


  deleteMessage() {
    this.chatService.deleteMessage(this.index);
  }

}

