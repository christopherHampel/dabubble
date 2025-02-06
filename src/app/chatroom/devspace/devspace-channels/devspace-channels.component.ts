import { Component } from '@angular/core';
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

  openChannels() {
    if (this.channelsOpen) {
      this.channelsOpen = false;
    } else {
      this.channelsOpen = true;
    }
  }
}
