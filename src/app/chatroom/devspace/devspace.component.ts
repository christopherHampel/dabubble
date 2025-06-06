import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevspaceChannelsComponent } from './devspace-channels/devspace-channels.component';
import { DevspaceDirectmessagesComponent } from './devspace-directmessages/devspace-directmessages.component';
import { HideOrShowNavbarComponent } from './hide-or-show-navbar/hide-or-show-navbar.component';
import { Router } from '@angular/router';
import { ThreadsDbService } from '../../services/message/threads-db.service';
import { ResizeService } from '../../services/responsive/resize.service';
import { UsersDbService } from '../../services/usersDb/users-db.service';
import { SearchFieldComponent } from "../messages/default/search-field/search-field.component";

@Component({
  selector: 'app-devspace',
  imports: [
    CommonModule,
    DevspaceChannelsComponent,
    DevspaceDirectmessagesComponent,
    HideOrShowNavbarComponent,
    SearchFieldComponent
],
  templateUrl: './devspace.component.html',
  styleUrl: './devspace.component.scss',
})
export class DevspaceComponent {

  constructor(
    private route: Router,
    private threadService: ThreadsDbService,
    private resize: ResizeService,
    public usersDb: UsersDbService,
    ) {}

  get devSpaceClose() {
    return this.resize.devSpaceClose();
  }

  goToDefault() {
    if (this.threadService.currentThreadId()) {
      this.threadService.closeThread();
    }
    this.resize.checkSiteWidth(960);
    this.route.navigate(['/chatroom']);
  }

  openMobileWrapper() {
    this.resize.setMobileWrapper(!this.resize.wrapperMobile());
  }
}
