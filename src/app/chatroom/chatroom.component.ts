import { Component, inject } from '@angular/core';
import { DevspaceComponent } from './devspace/devspace.component';
import { MessagesComponent } from './messages/messages.component';
import { ThreadsComponent } from './threads/threads.component';
import { AuthService } from '../services/auth/auth.service';
import { UsersDbService } from '../services/usersDb/users-db.service';

@Component({
  selector: 'app-chatroom',
  imports: [ DevspaceComponent, MessagesComponent, ThreadsComponent ],
  templateUrl: './chatroom.component.html',
  styleUrl: './chatroom.component.scss'
})
export class ChatroomComponent {
  currentUser: string = '';
  private auth = inject(AuthService);
  private usersDb = inject(UsersDbService);

  ngOnInit() {
    this.auth.user$.subscribe((user) => {
      if (user) {
        this.usersDb.currentUserSig.set({
          id: user.uid,
          userName: user.displayName!,
          email: user.email!,
          avatar: user.photoURL!,
          active: true
        });
        console.log(this.usersDb.currentUserSig()?.email + ' Login!');
      } else {
        console.log(this.usersDb.currentUserSig()?.email + ' Logout!');
        this.usersDb.currentUserSig.set(null);
      }
    });
  }

  onUserSelected(username: string): void {
    this.currentUser = username;
    console.log('Aktueller Benutzer:', this.currentUser);
  }
}
