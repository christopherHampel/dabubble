import { Component, EventEmitter, Output } from '@angular/core';
import { DevspaceChannelsComponent } from './devspace-channels/devspace-channels.component';
import { DevspaceDirectmessagesComponent } from './devspace-directmessages/devspace-directmessages.component';
import { HideOrShowNavbarComponent } from './hide-or-show-navbar/hide-or-show-navbar.component';

@Component({
  selector: 'app-devspace',
  imports: [ DevspaceChannelsComponent, DevspaceDirectmessagesComponent, HideOrShowNavbarComponent ],
  templateUrl: './devspace.component.html',
  styleUrl: './devspace.component.scss'
})
export class DevspaceComponent {

}
