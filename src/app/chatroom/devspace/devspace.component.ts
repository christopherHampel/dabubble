import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevspaceChannelsComponent } from './devspace-channels/devspace-channels.component';
import { DevspaceDirectmessagesComponent } from './devspace-directmessages/devspace-directmessages.component';
import { HideOrShowNavbarComponent } from './hide-or-show-navbar/hide-or-show-navbar.component';
import { Router } from '@angular/router';
import { ChatsService } from '../../services/message/chats.service';
import { ThreadsDbService } from '../../services/message/threads-db.service';
import { ResizeService } from '../../services/responsive/resize.service';

@Component({
  selector: 'app-devspace',
  imports: [
    CommonModule,
    DevspaceChannelsComponent,
    DevspaceDirectmessagesComponent,
    HideOrShowNavbarComponent,
  ],
  templateUrl: './devspace.component.html',
  styleUrl: './devspace.component.scss',
})
export class DevspaceComponent {
  // devspaceClose: boolean = false;

  constructor(
    private route: Router,
    private threadService: ThreadsDbService,
    private resizeService: ResizeService
  ) {}

  get devSpaceClose() {
    return this.resizeService.devSpaceClose()
  }

  goToDefault() {
    if (this.threadService.currentThreadId()) {
      this.threadService.closeThread();
    }
    this.route.navigate(['/chatroom']);
  }
}
