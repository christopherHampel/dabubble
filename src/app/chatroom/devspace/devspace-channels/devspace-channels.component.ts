import {Component, effect, inject, signal, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CreateChannelDialogComponent} from './create-channel-dialog/create-channel-dialog.component';
import {AddPeopleDialogComponent} from './add-people-dialog/add-people-dialog.component';
import {ChannelsDbService} from '../../../services/message/channels-db.service';
import {Router} from '@angular/router';
import {UsersDbService} from '../../../services/usersDb/users-db.service';
import {ResizeService} from '../../../services/responsive/resize.service';
import { DialogWindowControlService } from '../../../services/dialog-window-control/dialog-window-control.service';
import { TransparentBackgroundComponent } from '../../../shared/transparent-background/transparent-background.component';
import {Channel} from '../../../interfaces/channel';

@Component({
  selector: 'app-devspace-channels',
  imports: [
    CommonModule,
    CreateChannelDialogComponent,
    AddPeopleDialogComponent,
    TransparentBackgroundComponent
  ],
  templateUrl: './devspace-channels.component.html',
  styleUrl: './devspace-channels.component.scss'
})
export class DevspaceChannelsComponent {
  private channelsDb = inject(ChannelsDbService);
  usersDb = inject(UsersDbService);
  dialogWindowControl = inject(DialogWindowControlService);

  channelsOpen: boolean = true;
  dialog: boolean = false;
  flag: boolean = true;
  getLocalChannelList: Channel[] = [];

  selectedChannelIdSig = signal<string>('');

  @ViewChild('createChannel') createChannel!: any;
  @ViewChild('addPeople') addPeople!: any;

  constructor(private router: Router, private resize: ResizeService) {
    effect(() => {
      if (this.usersDb.currentUser?.channelFriendHighlighted) {
        this.selectedChannelIdSig.set(this.usersDb.currentUser.channelFriendHighlighted);
      }

      if (this.flag) this.getLocalChannelList = this.channelsDb.channelList;
      setTimeout(() => this.flag = false, 2500);
    })
  }


  selectChannel(id: string) {
    this.resize.checkSiteWidth(960);
    this.usersDb.updateChanelFriendHighlighted(id);
    this.selectedChannelIdSig.set(id);
  }


  getChannelList() {
    if (this.channelsDb.channelList) {
      return this.getLocalChannelList;
    } else {
      return [];
    }
  }


  openChannels() {
    this.channelsOpen = !this.channelsOpen;
  }


  openCreateChannel() {
    this.dialogWindowControl.openDialog('createChannel')
    this.createChannel.focusInput();
  }

  closeAddPeopleDialog() {
    if (this.resize.checkMediaW960px) {
      this.addPeople.closeAddPeopleDialogMobile();
    } else {
      this.addPeople.closeAddPeopleDialog();
    }
  }


  openChannel(id: string) {
    this.router.navigate(['/chatroom', {outlets: {chats: ['channel', id], thread: null}}]);
  }

  isDialogOpen() {
    return this.dialogWindowControl.isCreateChannelOpen || this.dialogWindowControl.isAddPeopleOpen;
  }
}
