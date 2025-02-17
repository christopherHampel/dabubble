import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateChannelDialogComponent } from './create-channel-dialog/create-channel-dialog.component';
import { AddPeopleDialogComponent } from './add-people-dialog/add-people-dialog.component';
import { TransparentBackgroundComponent } from '../../../shared/transparent-background/transparent-background.component';
import { ChannelsDbService } from '../../../services/message/channels-db.service';
import { Router } from '@angular/router';

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

  channelsOpen: boolean = true;
  dialog: boolean = false;
  selectedChannelId: string = '';
  dialogComponent: 'none' | 'createChannel' | 'addPeople' = 'none';

  @ViewChild('channelDialog') channelDialog!: any;
  @ViewChild('peopleDialog') peopleDialog!: any;

  constructor(private router: Router) { }


  selectChannel(id: string) {
    this.selectedChannelId = id;
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
