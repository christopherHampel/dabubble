import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChannelsDbService } from '../../../services/message/channels-db.service';
import { ActivatedRoute } from '@angular/router';
import { EmojisService } from '../../../services/message/emojis.service';
import { EmojiPickerComponentComponent } from '../../../shared/textarea/emoji-picker-component/emoji-picker-component.component';
import { TextareaComponent } from '../../../shared/textarea/textarea.component';
import { ChatsService } from '../../../services/message/chats.service';
import { ChannelDataWindowComponent } from './channel-data-window/channel-data-window.component';
import { TransparentBackgroundComponent } from '../../../shared/transparent-background/transparent-background.component';

@Component({
  selector: 'app-channel',
  imports: [
    CommonModule,
    EmojiPickerComponentComponent,
    TextareaComponent,
    ChannelDataWindowComponent,
    TransparentBackgroundComponent
  ],
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.scss'
})
export class ChannelComponent {
  channelDb = inject(ChannelsDbService);
  chatId:string = "";
  dialog: boolean = false;

  @ViewChild('channelDataWindow') channelDataWindow!: any;

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


  openDialog() {
    this.dialog = true;
  }


  closeDialog(event: boolean) {
    this.channelDataWindow.closeDialog();
    this.dialog = event;
  }


  getChannelParticipantsDetails() {
    return this.channelDb.channel.participantsDetails;
  }


  addEmoji(event:string) {
    console.log(event);
    this.emojiService.addEmoji(event, this.chatId);
  }
}
