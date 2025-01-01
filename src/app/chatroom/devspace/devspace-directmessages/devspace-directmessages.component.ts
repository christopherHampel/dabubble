import { Component, effect, EventEmitter, inject, Output } from '@angular/core';
import { AddFriendDialogComponent } from './add-friend-dialog/add-friend-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ChatsService } from '../../../services/message/chats.service';
import { UsersDbService } from '../../../services/usersDb/users-db.service';
import { UserProfile } from '../../../interfaces/userProfile';

@Component({
  selector: 'app-devspace-directmessages',
  imports: [CommonModule],
  templateUrl: './devspace-directmessages.component.html',
  styleUrl: './devspace-directmessages.component.scss'
})
export class DevspaceDirectmessagesComponent {
  readonly dialog = inject(MatDialog);
  usersDb = inject(UsersDbService);
  loadingCurrentUser: boolean = false;
  @Output() userSelected = new EventEmitter<string>();

  constructor(private chatService: ChatsService, private router: Router) {
    effect(() => {
      if (this.usersDb.currentUserSig()) {
        this.loadingCurrentUser = true;
      } else {
        console.log('Wait loading');
      }
    })
  }

  getUserList() {
    if (this.usersDb.currentUserSig()?.directmessages) {
      return this.usersDb.userListSig().filter(user => this.getCurrentUser()?.directmessages.includes(user.id));
    } else {
      return [];
    }
  }

  getCurrentUser() {
      let currentUser: UserProfile | null = null;
    if (this.usersDb.currentUserSig()) {
      currentUser = {
        id: this.usersDb.currentUserSig()!.id,
        userName: this.usersDb.currentUserSig()!.userName,
        email: this.usersDb.currentUserSig()!.email,
        avatar: this.usersDb.currentUserSig()!.avatar,
        active: true,
        directmessages: this.usersDb.currentUserSig()!.directmessages
      }
      return currentUser;
    } else {
      currentUser = {
        id: '',
        userName: 'Horst Schmidt',
        email: '',
        avatar: '',
        active: true,
        directmessages: []
      }
      return currentUser;
    }
  }

  openDialog(): void {
    this.dialog.open(AddFriendDialogComponent);
  }

  async selectName(name: string) {
    const chatId = await this.chatService.setPrivateChat(name);
    this.router.navigate([`/chatroom/direct-message/${chatId}`]);
  }
}
