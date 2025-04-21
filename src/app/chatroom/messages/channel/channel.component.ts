import {
  Component,
  inject,
  signal,
  ViewChild,
  WritableSignal,
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ChannelsDbService} from '../../../services/message/channels-db.service';
import {ActivatedRoute} from '@angular/router';
import {EmojisService} from '../../../services/message/emojis.service';
import {
  EmojiPickerComponentComponent
} from '../../../shared/textarea/emoji-picker-component/emoji-picker-component.component';
import {TextareaComponent} from '../../../shared/textarea/textarea.component';
import {ChatsService} from '../../../services/message/chats.service';
import {ScrollService} from '../../../services/message/scroll.service';
import {MessagesFieldComponent} from '../../../shared/messages-field/messages-field.component';
import {ChannelDataWindowComponent} from './channel-data-window/channel-data-window.component';
import {ChannelMembersInfoComponent} from './channel-members-info/channel-members-info.component';
import {TransparentBackgroundComponent} from '../../../shared/transparent-background/transparent-background.component';
import {UsersDbService} from '../../../services/usersDb/users-db.service';
import {ChannelAddMembersDialogComponent} from './channel-add-members-dialog/channel-add-members-dialog.component';
import {Observable} from 'rxjs';
import {ThreadsDbService} from '../../../services/message/threads-db.service';
import {ResizeService} from '../../../services/responsive/resize.service';
import {DialogWindowControlService} from '../../../services/dialog-window-control/dialog-window-control.service';

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
    ChannelAddMembersDialogComponent,
  ],
  templateUrl: './channel.component.html',
  styleUrl: './channel.component.scss',
  providers: [ScrollService],
})
export class ChannelComponent {
  channelsDb = inject(ChannelsDbService);
  usersDb = inject(UsersDbService);
  dialogWindowControl = inject(DialogWindowControlService);

  chatId: string = '';
  chatMessages$!: Observable<any[]>;

  @ViewChild('membersInfo') membersInfo!: any;
  @ViewChild('addMembers') addMembers!: any;

  constructor(
    private activatedRoute: ActivatedRoute,
    public emojiService: EmojisService,
    public chatService: ChatsService,
    private threadsDb: ThreadsDbService,
    public resize: ResizeService
  ) {
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe(async (params) => {
      this.channelsDb.subToChannel(params['id']);
      this.chatId = params['id'];
      this.threadsDb.closeThread();
      this.getMessages();
      this.chatMessages$ = this.chatService.messages$;
    });
  }

  get getChannelName() {
    return this.channelsDb.channelSig()?.name;
  }

  getMessages() {
    this.chatService.getMessagesFromChat(this.chatId, 'channels');
  }

  openDialog(child: string) {
    this.dialogWindowControl.openDialog(child);
    child === 'addMembers' ? this.addMembersDialogFocus() : null;
  }

  addMembersDialogFocus() {
    setTimeout(() => this.addMembers.focusInput(), 250);
  }

  closeAddMembersDialog() {
    this.addMembers.closeAddMembersDialog();
  }

  closeUserProfilDialog() {
    this.membersInfo.closeUserProfilDialog(false);
  }

  isDialogOpen() {
    return this.dialogWindowControl.isDataWindowOpen || this.dialogWindowControl.isMembersInfoOpen
      || this.dialogWindowControl.isAddMembersOpen;
  }

  addEmoji(event: string) {
    this.emojiService.addEmoji(event, this.chatId, 'channels');
  }
}
