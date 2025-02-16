import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevspaceChannelsComponent } from './devspace-channels/devspace-channels.component';
import { DevspaceDirectmessagesComponent } from './devspace-directmessages/devspace-directmessages.component';
import { HideOrShowNavbarComponent } from './hide-or-show-navbar/hide-or-show-navbar.component';
import { Router } from '@angular/router';
import { ChatsService } from '../../services/message/chats.service';

@Component({
  selector: 'app-devspace',
  imports: [ CommonModule, DevspaceChannelsComponent, DevspaceDirectmessagesComponent, HideOrShowNavbarComponent ],
  templateUrl: './devspace.component.html',
  styleUrl: './devspace.component.scss'
})
export class DevspaceComponent {
  devspaceClose: boolean = false;

  constructor(
    private route: Router,
    private chatService: ChatsService) {}

  goToDefault() {
    // this.chatService.chatPartner = {name: '', avatar: ''};
    // setTimeout( () => {    
      this.route.navigate(['/chatroom', { outlets: { chats: 'default', channel: null, thread: null } }]);
    // }, 100)
  }
}
