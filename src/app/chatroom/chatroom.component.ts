import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevspaceComponent } from './devspace/devspace.component';
import { MessagesComponent } from './messages/messages.component';
import { ThreadsComponent } from './threads/threads.component';
import { ChatroomHeaderComponent } from './chatroom-header/chatroom-header.component';
import { AuthService } from '../services/auth/auth.service';
import { UsersDbService } from '../services/usersDb/users-db.service';
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
  private usersDb = inject(UsersDbService);

  constructor(private router: Router) { }

  ngOnInit() {
    this.auth.user$.subscribe((user) => {
      if (user) {
        this.usersDb.subScribeToUser(user!.uid);
      } else {
        this.router.navigateByUrl('/register/login');
      }
    })
  }

  onUserSelected(username: string): void {
    this.currentUser = username;
    console.log('Aktueller Benutzer:', this.currentUser);
  }
}
