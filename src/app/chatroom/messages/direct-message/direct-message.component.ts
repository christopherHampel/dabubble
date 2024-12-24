import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MessagesServiceService } from '../../../services/messages/messages.service.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-direct-message',
  imports: [ CommonModule, FormsModule ],
  templateUrl: './direct-message.component.html',
  styleUrl: './direct-message.component.scss'
})
export class DirectMessageComponent {
  chatId: string | null = null;
  chatData: any = null;
  text:string = '';

  constructor(private route: ActivatedRoute, private chatService: MessagesServiceService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(async params => {
      this.chatId = params.get('id');
      if (this.chatId) {
        this.chatData = await this.chatService.getChatData(this.chatId);
        console.log('Chat-Daten:', this.chatData);
      }
    });
  }

  async sendText() {
    await this.chatService.addTextToChat(this.text, this.chatId);
    console.log(this.text);
    this.text = '';
  }
}
