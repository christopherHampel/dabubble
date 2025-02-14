import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreateChannelDialogComponent } from './create-channel-dialog/create-channel-dialog.component';
import { AddPeopleDialogComponent } from './add-people-dialog/add-people-dialog.component';
import { TransparentBackgroundComponent } from '../../../shared/transparent-background/transparent-background.component';

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
  channelsOpen: boolean = true;
  dialog: boolean = false;
  dialogComponent: 'none' | 'createChannel' | 'addPeople' = 'none';
  @ViewChild('channelDialog') channelDialog!: any;
  @ViewChild('peopleDialog') peopleDialog!: any;
  
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
}
