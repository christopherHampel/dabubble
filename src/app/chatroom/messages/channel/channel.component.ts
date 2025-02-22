import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChannelsDbService } from '../../../services/message/channels-db.service';
import { ActivatedRoute } from '@angular/router';
import { EmojisService } from '../../../services/message/emojis.service';
import { EmojiPickerComponentComponent } from '../../../shared/textarea/emoji-picker-component/emoji-picker-component.component';
import { TextareaComponent } from '../../../shared/textarea/textarea.component';
import { ChatsService } from '../../../services/message/chats.service';
import { SingleMessageComponent } from "../single-message/single-message.component";
import { Observable } from 'rxjs';

@Component({
  selector: 'app-channel',
  imports: [
    CommonModule,
    EmojiPickerComponentComponent,
    TextareaComponent,
    SingleMessageComponent
],
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.scss'
})
export class ChannelComponent {
  channelDb = inject(ChannelsDbService);
  chatId:string = "";
  // chatMessages$!: Observable<any[]>;

  constructor(
    private activatedRoute: ActivatedRoute,
    public emojiService: EmojisService,
    public chatService: ChatsService ) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.channelDb.subToChannel(params['id']);
      this.chatId = params['id'];
    });
    this.getMessages();    
  }

  getMessages() {
    this.chatService.getMessagesFromChat(this.chatId);
  }


  getChannelParticipantsDetails() {
    return this.channelDb.channelData.participantsDetails;
  }

  addEmoji(event:string) {
    console.log(event);
    this.emojiService.addEmoji(event, this.chatId);
  }

  trackByFn(index: number, item: any): number | string {
    return item.id;
  }

}
