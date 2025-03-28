import { Component, effect, inject, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateChannelDialogComponent } from './create-channel-dialog/create-channel-dialog.component';
import { AddPeopleDialogComponent } from './add-people-dialog/add-people-dialog.component';
import { TransparentBackgroundComponent } from '../../../shared/transparent-background/transparent-background.component';
import { ChannelsDbService } from '../../../services/message/channels-db.service';
import { Router } from '@angular/router';
import { UsersDbService } from '../../../services/usersDb/users-db.service';
import { ResizeService } from '../../../services/responsive/resize.service';

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

  channelsOpen: boolean = true;
  dialog: boolean = false;
  selectedChannelIdSig = signal<string>('');
  dialogComponent: 'none' | 'createChannel' | 'addPeople' = 'none';

  @ViewChild('channelDialog') channelDialog!: any;
  @ViewChild('peopleDialog') peopleDialog!: any;

  constructor(private router: Router, private resize: ResizeService) {
    effect(() => {
      if (this.usersDb.currentUser?.channelFriendHighlighted) {
        this.selectedChannelIdSig.set(this.usersDb.currentUser.channelFriendHighlighted);
      }
    })
  }


  selectChannel(id: string) {
    this.resize.setZIndexChats(true);
    this.usersDb.updateChanelFriendHighlighted(id);
    this.selectedChannelIdSig.set(id);
  }


  getChannelList() {
    return this.channelsDb.channelList;
  }


  openChannels() {
    if (this.channelsOpen) {
      this.channelsOpen = false;
    } else {
      this.channelsOpen = true;
    }
  }


  openDialog() {
    this.dialogComponent = 'createChannel';
    this.dialog = true;
    this.channelDialog.focusInput();
  }


  closeDialog(event: any) {
    this.dialogComponent = event;
    this.dialogComponent !== 'addPeople' ? this.dialog = false : true;
    this.channelDialog.resetInputs();
    this.peopleDialog.resetOption();
  }


  openChannel(id: string) {
    this.router.navigate(['/chatroom', { outlets: { chats: ['channel', id], thread: null } }]);
  }
}
