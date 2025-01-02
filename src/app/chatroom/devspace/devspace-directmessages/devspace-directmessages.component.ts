import { Component, inject } from '@angular/core';
import { AddFriendDialogComponent } from './add-friend-dialog/add-friend-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ChatsService } from '../../../services/message/chats.service';
import { UsersDbService } from '../../../services/usersDb/users-db.service';

@Component({
  selector: 'app-devspace-directmessages',
  imports: [CommonModule],
  templateUrl: './devspace-directmessages.component.html',
  styleUrl: './devspace-directmessages.component.scss'
})
export class DevspaceDirectmessagesComponent {
  readonly dialog = inject(MatDialog);
  private usersDb = inject(UsersDbService);

  constructor(private chatService: ChatsService, private router: Router) { 
    console.log(this.getCurrentUser());
  }

  getCurrentUser() {
    return this.usersDb.currentUser;
  }

  getUserList() {
    if (this.usersDb.currentUser.directmessages) {
      return this.usersDb.userList.filter(user => this.usersDb.currentUser.directmessages.includes(user.id));
    } else {
      return [];
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
