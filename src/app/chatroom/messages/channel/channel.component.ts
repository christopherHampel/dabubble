
import { Component, ElementRef, inject, signal, ViewChild, WritableSignal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChannelsDbService } from '../../../services/message/channels-db.service';
import { ActivatedRoute } from '@angular/router';
import { EmojisService } from '../../../services/message/emojis.service';
import { EmojiPickerComponentComponent } from '../../../shared/textarea/emoji-picker-component/emoji-picker-component.component';
import { TextareaComponent } from '../../../shared/textarea/textarea.component';
import { ChatsService } from '../../../services/message/chats.service';
import { ScrollService } from '../../../services/message/scroll.service';
import { MessagesFieldComponent } from '../../../shared/messages-field/messages-field.component';
import { ChannelDataWindowComponent } from './channel-data-window/channel-data-window.component';
import { ChannelMembersInfoComponent } from './channel-members-info/channel-members-info.component';
import { TransparentBackgroundComponent } from '../../../shared/transparent-background/transparent-background.component';
import { UsersDbService } from '../../../services/usersDb/users-db.service';
import { ChannelAddMembersDialogComponent } from './channel-add-members-dialog/channel-add-members-dialog.component';

@Component({
  selector: 'app-channel',
  imports: [
    CommonModule,
    EmojiPickerComponentComponent,
    TextareaComponent,
    MessagesFieldComponent,
    ChannelDataWindowComponent,
    ChannelMembersInfoComponent,
    TransparentBackgroundComponent,
    ChannelAddMembersDialogComponent
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

  dataWindow: boolean = false;
  membersInfo: boolean = false;
  addMembers: boolean = false;

  @ViewChild('channelDataWindow') channelDataWindow!: any;
  @ViewChild('channelAddMembersInfo') channelAddMembersInfo!: any;
  @ViewChild('myScrollContainer') private myScrollContainer!: ElementRef;

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

  openDialog(child: string) {
    switch (child) {
      case 'dataWindow':
        this.dataWindow = true;
        break;
      case 'membersInfo':
        this.membersInfo = true;
        break;
      case 'addMembers':
        this.addMembers = true;
        this.channelAddMembersInfo.resetAfterViewChecked();
        break;
    }
  }


  openAddMembers(event: boolean) {
    this.membersInfo = !event;
    this.addMembers = event;
    this.channelAddMembersInfo.resetAfterViewChecked();
  }


  closeDialog(event: boolean) {
    this.dataWindow = event;
    this.channelDataWindow.resetOnClose();

    this.membersInfo = event;
    this.addMembers = event;
  }

  addEmoji(event: string) {
    console.log(event);
    this.emojiService.addEmoji(event, this.chatId, 'channels');
  }

  // ngAfterViewInit() {
  //   this.scrollService.setScrollContainer(this.myScrollContainer);
  // }
}
