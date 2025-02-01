import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevspaceComponent } from './devspace/devspace.component';
import { MessagesComponent } from './messages/messages.component';
import { ThreadRouterOutletComponent } from './threads/thread-router-outlet/thread-router-outlet.component';
import { AuthService } from '../services/auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersDbService } from '../services/usersDb/users-db.service';
import { ChatroomHeaderComponent } from './chatroom-header/chatroom-header.component';

@Component({
  selector: 'app-chatroom',
  imports: [CommonModule, DevspaceComponent, MessagesComponent, ThreadRouterOutletComponent, ChatroomHeaderComponent],
  templateUrl: './chatroom.component.html',
  styleUrl: './chatroom.component.scss'
})
export class ChatroomComponent {
  currentUser: string = '';
  private auth = inject(AuthService);
  private userDb = inject(UsersDbService)

  constructor(private router: Router) { }

  ngOnInit() {
    this.auth.currentAuthUser.subscribe((user) => {
      if (user) {
        this.userDb.updateUserStatus(user.uid, true);
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
