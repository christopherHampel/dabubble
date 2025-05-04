import {Component, effect, EventEmitter, inject, Input, Output, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ChannelsDbService} from '../../../../services/message/channels-db.service';
import {UsersDbService} from '../../../../services/usersDb/users-db.service';
import {Router} from '@angular/router';
import {UserViewSmallComponent} from '../../../../shared/user-view-small/user-view-small.component';
import {UserProfile} from '../../../../interfaces/userProfile';
import {ResizeService} from '../../../../services/responsive/resize.service';
import { DialogWindowControlService } from '../../../../services/dialog-window-control/dialog-window-control.service';
import { ChatsService } from '../../../../services/message/chats.service';

@Component({
  selector: 'app-channel-data-window',
  imports: [
    CommonModule,
    FormsModule,
    UserViewSmallComponent,
  ],
  templateUrl: './channel-data-window.component.html',
  styleUrl: './channel-data-window.component.scss'
})
export class ChannelDataWindowComponent {
  channelsDb = inject(ChannelsDbService);
  userDb = inject(UsersDbService);
  resize = inject(ResizeService);
  dialogWindowControl = inject(DialogWindowControlService);

  channelNameEdit: boolean = false;
  channelDescriptionEdit: boolean = false;
  channelName: string = '';
  channelDescription: string = '';
  channelUserDataListReverse: UserProfile[] = [];

  @Output() addMembersDialogFocus = new EventEmitter<boolean>();

  constructor(private router: Router, private chatService: ChatsService) {
    effect(() => {
      this.channelUserDataListReverse = [];

      this.channelsDb.channelUserDataList.forEach(userData => {
        this.channelUserDataListReverse.unshift(userData);
      })
    });
  }


  openAddMembers() {
    this.dialogWindowControl.openDialog('addMembers')
    this.addMembersDialogFocus.emit(true);
  }


  getUserCreated(id: string) {
    return this.channelsDb.channel?.participants.find(user => user.id === id)?.createdBy;
  }


  closeDataWindowDialog() {
    this.resetOnClose();
    this.dialogWindowControl.closeDialog('dataWindow');
    this.chatService.setZIndexForNavBarButton(false);
  }


  resetOnClose() {
    this.channelNameEdit = false;
    this.channelDescriptionEdit = false;
  }


  editChannel(edit: string) {
    edit === 'name' ? this.channelNameEdit = !this.channelNameEdit :
    edit === 'description' ? this.channelDescriptionEdit = !this.channelDescriptionEdit : null;

    if (this.channelNameEdit || this.channelDescriptionEdit) {
      this.channelsDb.channel ? this.updateValue(this.channelsDb.channel.name) : '';
      this.channelsDb.channel ? this.channelDescription = this.channelsDb.channel.description : '';
    }
  }


  isMobile() {
    return this.dialogWindowControl.isDataWindowOpen && this.dialogWindowControl.isAddMembersOpen;
  }


  Backspace?: KeyboardEvent;

  onKeyDown(event: KeyboardEvent) {
    this.Backspace = event;
  }


  updateValue(value: string) {
    if (value === '#   ' && this.Backspace!.key === 'Backspace') {
      this.channelName = '';
    }

    if (!value.startsWith('#   ')) {
      this.channelName = '#   ' + value.trimStart();
    }
  }


  async saveChannel() {
    this.channelsDb.updateChannel({
      name: this.channelName.substring(this.channelName.includes('#') ? 4 : 0),
      description: this.channelDescription
    })

    await this.channelsDb.changeChannel();

    this.channelsDb.triggerAddChannel();
  }


  async leaveChannel() {
    let participants: { id: string, createdBy: boolean }[];
    let participantIds: string[] = [];

    participants = this.channelsDb.channel?.participants
      .filter(participant => participant.id !== this.userDb.currentUser?.id)
      .map((participant, index) => ({
        id: participant.id,
        createdBy: index === 0 ? true : participant.createdBy
      })) || [];

    this.channelsDb.channel?.participantIds.forEach(id => {
      if (id !== this.userDb.currentUser?.id) participantIds.push(id);
    });

    this.channelsDb.updateChannel({
      participants: participants,
      participantIds: participantIds
    });

    await this.channelsDb.changeChannel();

    this.channelsDb.triggerAddChannel();

    this.closeDataWindowDialog();
    this.router.navigate(['/chatroom']);
  }
}
