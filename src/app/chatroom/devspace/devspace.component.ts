import { Component, EventEmitter, Output } from '@angular/core';
import { DevspaceChannelsComponent } from './devspace-channels/devspace-channels.component';
import { DevspaceDirectmessagesComponent } from './devspace-directmessages/devspace-directmessages.component';

@Component({
  selector: 'app-devspace',
  imports: [ DevspaceChannelsComponent, DevspaceDirectmessagesComponent ],
  templateUrl: './devspace.component.html',
  styleUrl: './devspace.component.scss'
})
export class DevspaceComponent {

}
