import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ChatsService } from '../../../services/message/chats.service';
import { UsersDbService } from '../../../services/usersDb/users-db.service';
import { AddFriendDialogComponent } from './add-friend-dialog/add-friend-dialog.component';
import { TransparentBackgroundComponent } from '../../../shared/transparent-background/transparent-background.component';

@Component({
  selector: 'app-devspace-directmessages',
  imports: [CommonModule, AddFriendDialogComponent, TransparentBackgroundComponent],
  templateUrl: './devspace-directmessages.component.html',
  styleUrl: './devspace-directmessages.component.scss'
})
export class DevspaceDirectmessagesComponent {
  usersDb = inject(UsersDbService);
  dialog: boolean = false;
  lastSelectedUserId: string = '';

  constructor(private chatService: ChatsService, private router: Router) { }

  ngOnInit() {
    console.log(this.lastSelectedUserId);
  }

  changeClickStatus(id: string) {
    if (this.lastSelectedUserId) {
      this.usersDb.updateClickStatus(this.lastSelectedUserId, false);
    }
    this.selectUser(id);
  }

  selectUser(id: string) {
    this.usersDb.updateClickStatus(id, true);
    this.lastSelectedUserId = id;
  }

  openDialog() {
    this.dialog = true;
  }

  closeDialog(event: boolean) {
    this.dialog = event;
  }

  getUserList() {
    if (this.usersDb.currentUser) {
      return this.usersDb.userList.filter(user => this.usersDb.currentUser!.directmessagesWith.includes(user.id));
    } else {
      return [];
    }
  }

  async selectName(name: string) {
    const chatId = await this.chatService.setPrivateChat(name);
    this.router.navigate([`/chatroom/direct-message/${chatId}`]);
  }
}
