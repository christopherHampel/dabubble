import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ChatsService } from '../../../services/message/chats.service';
import { UsersDbService } from '../../../services/usersDb/users-db.service';
import { AddFriendDialogComponent } from './add-friend-dialog/add-friend-dialog.component';
import { TransparentBackgroundComponent } from '../../../shared/transparent-background/transparent-background.component';
import { UserProfile } from '../../../interfaces/userProfile';
import { UserViewSmallComponent } from '../../../shared/user-view-small/user-view-small.component';

@Component({
  selector: 'app-devspace-directmessages',
  imports: [
    CommonModule,
    AddFriendDialogComponent,
    TransparentBackgroundComponent,
    UserViewSmallComponent
  ],
  templateUrl: './devspace-directmessages.component.html',
  styleUrl: './devspace-directmessages.component.scss'
})
export class DevspaceDirectmessagesComponent {

  usersDb = inject(UsersDbService);
  dialog: boolean = false;
  selectedUserId: string = '';
  directmessagesOpen: boolean = true;

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

  trackByUserId(index: number, user: any): number {
    return user.id;
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
      this.router.navigate(['/chatroom', {outlets: {chats: ['direct-message', chatId]}}]);
      // this.router.navigate(['/chatroom', { outlets: { chats: ['direct-message'] } }]);
    } catch (error) {
      console.error('Fehler beim Erstellen des Chats:', error);
    }
  }
}
