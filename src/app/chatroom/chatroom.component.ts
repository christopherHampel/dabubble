import { Component } from '@angular/core';
import { DevspaceComponent } from './devspace/devspace.component';
import { MessagesComponent } from './messages/messages.component';
import { ThreadsComponent } from './threads/threads.component';

@Component({
  selector: 'app-chatroom',
  imports: [ DevspaceComponent, MessagesComponent, ThreadsComponent ],
  templateUrl: './chatroom.component.html',
  styleUrl: './chatroom.component.scss'
})
export class ChatroomComponent {
  currentUser: string = '';

  onUserSelected(username: string): void {
    this.currentUser = username;
    console.log('Aktueller Benutzer:', this.currentUser);
  }
}
