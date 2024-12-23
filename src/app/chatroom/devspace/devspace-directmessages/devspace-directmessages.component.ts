import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-devspace-directmessages',
  imports: [],
  templateUrl: './devspace-directmessages.component.html',
  styleUrl: './devspace-directmessages.component.scss'
})
export class DevspaceDirectmessagesComponent {

  @Output() userSelected = new EventEmitter<string>();

  onUserClick(username: string): void {
    this.userSelected.emit(username);
  }

}
