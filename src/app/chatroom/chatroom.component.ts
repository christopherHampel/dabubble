import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevspaceComponent } from './devspace/devspace.component';
import { MessagesComponent } from './messages/messages.component';
import { ThreadsComponent } from './threads/threads.component';
import { ChatroomHeaderComponent } from './chatroom-header/chatroom-header.component';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chatroom',
  imports: [CommonModule, DevspaceComponent, MessagesComponent, ThreadsComponent, ChatroomHeaderComponent],
  templateUrl: './chatroom.component.html',
  styleUrl: './chatroom.component.scss'
})
export class ChatroomComponent {
  currentUser: string = '';
  private auth = inject(AuthService);

  constructor(private router: Router) { }

  ngOnInit() {
    this.auth.currentAuthUser.subscribe((user) => {
      if (!user) {
        this.router.navigateByUrl('/register/login');
      }
    })
  }

  onUserSelected(username: string): void {
    this.currentUser = username;
    console.log('Aktueller Benutzer:', this.currentUser);
  }
}
