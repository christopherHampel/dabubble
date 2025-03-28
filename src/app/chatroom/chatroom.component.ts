import { Component, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevspaceComponent } from './devspace/devspace.component';
import { MessagesComponent } from './messages/messages.component';
import { ThreadRouterOutletComponent } from './threads/thread-router-outlet/thread-router-outlet.component';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { UsersDbService } from '../services/usersDb/users-db.service';
import { ChatroomHeaderComponent } from './chatroom-header/chatroom-header.component';
import { ResizeService } from '../services/responsive/resize.service';

@Component({
  selector: 'app-chatroom',
  imports: [
    CommonModule,
    DevspaceComponent,
    MessagesComponent,
    ThreadRouterOutletComponent,
    ChatroomHeaderComponent
  ],
  templateUrl: './chatroom.component.html',
  styleUrl: './chatroom.component.scss'
})
export class ChatroomComponent {
  currentUser: string = '';
  private auth = inject(AuthService);
  private userDb = inject(UsersDbService)

  constructor(private router: Router, private resize: ResizeService, private usersDb: UsersDbService) { }

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

  under1000px() {
    this.resize.checkScreenSize(960);
    return this.resize.isSmallScreen
  }

  get zIndexChats() {
    return this.resize.zIndexChats();
  }

  get getCurrentUserImage(): string {
    return this.usersDb.currentUserSig()?.avatar || 'assets/default-avatar.png';
  }
}
