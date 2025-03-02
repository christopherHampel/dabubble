import { Component, ElementRef, inject, signal, ViewChild, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChannelsDbService } from '../../../services/message/channels-db.service';
import { ActivatedRoute } from '@angular/router';
import { EmojisService } from '../../../services/message/emojis.service';
import { EmojiPickerComponentComponent } from '../../../shared/textarea/emoji-picker-component/emoji-picker-component.component';
import { TextareaComponent } from '../../../shared/textarea/textarea.component';
import { ChatsService } from '../../../services/message/chats.service';
import { SingleMessageComponent } from '../single-message/single-message.component';
import { ScrollService } from '../../../services/message/scroll.service';
import { MessagesFieldComponent } from '../../../shared/messages-field/messages-field.component';
import { ChannelDataWindowComponent } from './channel-data-window/channel-data-window.component';
import { ChannelMembersInfoComponent } from './channel-members-info/channel-members-info.component';
import { TransparentBackgroundComponent } from '../../../shared/transparent-background/transparent-background.component';
import { UsersDbService } from '../../../services/usersDb/users-db.service';

@Component({
  selector: 'app-channel',
  imports: [
    CommonModule,
    EmojiPickerComponentComponent,
    TextareaComponent,
    SingleMessageComponent,
    MessagesFieldComponent,
    ChannelDataWindowComponent,
    ChannelMembersInfoComponent,
    TransparentBackgroundComponent
  ],
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.scss',
  providers: [ScrollService],
})
export class ChannelComponent {
  channelsDb = inject(ChannelsDbService);
  usersDb = inject(UsersDbService);
  chatId: string = '';
  lastMessageDocId: WritableSignal<string | null> = signal<string | null>(null);

  @ViewChild('myScrollContainer') private myScrollContainer!: ElementRef;
  dialog: boolean = false;

  @ViewChild('channelDataWindow') channelDataWindow!: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    public emojiService: EmojisService,
    private scrollService: ScrollService,
    public chatService: ChatsService) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe(async (params) => {
      this.channelsDb.subToChannel(params['id']);
      this.chatId = params['id'];
      this.getMessages();
    });
  }

  getMessages() {
    this.chatService.getMessagesFromChat(this.chatId, 'channels');
  }

  openDialog() {
    this.dialog = true;
  }

  closeDialog(event: boolean) {
    this.channelDataWindow.resetOnClose();
    this.dialog = event;
  }

  addEmoji(event: string) {
    console.log(event);
    this.emojiService.addEmoji(event, this.chatId, 'channels');
  }

  // ngAfterViewInit() {
  //   this.scrollService.setScrollContainer(this.myScrollContainer);
  // }
}
