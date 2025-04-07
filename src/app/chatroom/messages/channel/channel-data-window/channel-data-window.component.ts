import {Component, effect, EventEmitter, inject, Input, Output, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ChannelsDbService} from '../../../../services/message/channels-db.service';
import {UsersDbService} from '../../../../services/usersDb/users-db.service';
import {Router} from '@angular/router';
import {UserViewSmallComponent} from '../../../../shared/user-view-small/user-view-small.component';
import {UserProfile} from '../../../../interfaces/userProfile';
import {ResizeService} from '../../../../services/responsive/resize.service';

@Component({
  selector: 'app-channel-data-window',
  imports: [
    CommonModule,
    FormsModule,
    UserViewSmallComponent
  ],
  templateUrl: './channel-data-window.component.html',
  styleUrl: './channel-data-window.component.scss'
})
export class ChannelDataWindowComponent {
  channelsDb = inject(ChannelsDbService);
  userDb = inject(UsersDbService);
  resize = inject(ResizeService);
  editNameButton = signal<string>('Bearbeiten');
  editDescriptionButton = signal<string>('Bearbeiten');
  channelNameEdit: boolean = false;
  channelDescriptionEdit: boolean = false;
  channelName: string = '';
  channelDescription: string = '';
  channelUserDataListReverse: UserProfile[] = [];

  @Input() dialogOpen: boolean = false;
  @Output() dialogClose = new EventEmitter<boolean>();

  constructor(private router: Router) {
    effect(() => {
      this.channelUserDataListReverse = [];

      this.channelsDb.channelUserDataList.forEach(userData => {
        this.channelUserDataListReverse.unshift(userData);
      })
    });

    this.channelName = this.channelsDb.channel!.name;
    this.channelDescription = this.channelsDb.channel!.description;
  }


  getUserCreated(id: string) {
    return this.channelsDb.channel?.participants.find(user => user.id === id)?.createdBy;
  }


  closeDialog() {
    this.dialogOpen = false;
    this.dialogClose.emit(true);
    this.resetOnClose();
  }


  resetOnClose() {
    this.channelNameEdit = false;
    this.editNameButton.set('Bearbeiten');
    this.channelDescriptionEdit = false;
    this.editDescriptionButton.set('Bearbeiten');
  }


  editChannelName() {
    this.channelNameEdit = !this.channelNameEdit;

    if (this.channelNameEdit) {
      this.channelsDb.channel ? this.updateValue(this.channelsDb.channel.name) : '';
    }
  }


  editChannelDescription() {
    this.channelDescriptionEdit = !this.channelDescriptionEdit;

    if (this.channelDescriptionEdit) {
      this.channelsDb.channel ? this.channelDescription = this.channelsDb.channel.description : '';
    }
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
      name: this.channelName.substring(4),
      description: this.channelDescription
    })

    await this.channelsDb.changeChannel();
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

    this.closeDialog();
    this.router.navigate(['/chatroom']);
  }
}
