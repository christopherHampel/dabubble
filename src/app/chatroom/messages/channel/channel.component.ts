import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChannelsDbService } from '../../../services/message/channels-db.service';
import { ActivatedRoute } from '@angular/router';
import { EmojisService } from '../../../services/message/emojis.service';
import { EmojiPickerComponentComponent } from '../../../shared/textarea/emoji-picker-component/emoji-picker-component.component';
import { TextareaComponent } from '../../../shared/textarea/textarea.component';
import { ChatsService } from '../../../services/message/chats.service';

@Component({
  selector: 'app-channel',
  imports: [
    CommonModule,
    EmojiPickerComponentComponent,
    TextareaComponent
  ],
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.scss'
})
export class ChannelComponent {
  channelDb = inject(ChannelsDbService);
  chatId:string = "";

  constructor(
    private activatedRoute: ActivatedRoute,
    public emojiService: EmojisService,
    public chatService: ChatsService ) { }


  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.channelDb.subToChannel(params['id']);
      this.chatId = params['id'];
    });
  }


  getChannelParticipantsDetails() {
    return this.channelDb.channelData.participantsDetails;
  }

  addEmoji(event:string) {
    console.log(event);
    this.emojiService.addEmoji(event, this.chatId);
  }
}
