import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ChatsService } from '../../../services/message/chats.service';
import { UsersDbService } from '../../../services/usersDb/users-db.service';
import { AddFriendDialogComponent } from './add-friend-dialog/add-friend-dialog.component';
import { TransparentBackgroundComponent } from '../../../shared/transparent-background/transparent-background.component';
import { UserProfile } from '../../../interfaces/userProfile';

@Component({
  selector: 'app-devspace-directmessages',
  imports: [CommonModule, AddFriendDialogComponent, TransparentBackgroundComponent],
  templateUrl: './devspace-directmessages.component.html',
  styleUrl: './devspace-directmessages.component.scss'
})
export class DevspaceDirectmessagesComponent {
  usersDb = inject(UsersDbService);
  dialog: boolean = false;
  selectedUserId: string = '';
  directmessagesOpen: boolean = false;

  exampleUserProfile: UserProfile = {
    id: '12345abcde',
    userName: 'johndoe',
    email: 'johndoe@example.com',
    avatar: '/img/johndoe-avatar.png',
    active: true,
    clicked: false,
    directmessagesWith: ['67890fghij', '11223klmno']
  };

  constructor(private chatService: ChatsService, private router: Router) { }


  openDirectmessages() {
    if (this.directmessagesOpen) {
      this.directmessagesOpen = false;
    } else {
      this.directmessagesOpen = true;
    }
  }


  selectUser(id: string) {
    this.selectedUserId = id;
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
  };

  async selectChat(user: UserProfile) {
    try {
      const chatId = await this.chatService.setPrivateChat(user);
      this.chatService.currentChatId = chatId;
      this.router.navigate([`/chatroom/direct-message/${chatId}`]);
    } catch (error) {
      console.error('Fehler beim Erstellen des Chats:', error);
    }
  }
}
