import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatsService } from '../../services/message/chats.service';
import { CurrentMessage } from '../../interfaces/current-message';
import { EmojiPickerComponentComponent } from './emoji-picker-component/emoji-picker-component.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-textarea',
  imports: [ FormsModule, EmojiPickerComponentComponent, CommonModule ],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.scss'
})
export class TextareaComponent implements OnInit {

  @Input() message:string = '';
  @Input() chatPartnerName!:string;

  chatId:string = '';

  emojiMartOpen:boolean = false;

  constructor(public chatService: ChatsService, private route: ActivatedRoute) {  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.chatId = params.get('id')!;
    })
  }

  async sendText() {
    if(this.message.length > 0) {
      await this.chatService.addTextToChat(this.message, this.chatId);
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
