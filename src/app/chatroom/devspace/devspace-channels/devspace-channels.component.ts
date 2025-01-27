import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-devspace-channels',
  imports: [CommonModule],
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
