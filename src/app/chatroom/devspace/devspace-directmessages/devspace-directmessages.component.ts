import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ChatsService } from '../../../services/message/chats.service';
import { UsersDbService } from '../../../services/usersDb/users-db.service';
import { AddFriendDialogComponent } from './add-friend-dialog/add-friend-dialog.component';
import { TransparentBackgroundComponent } from '../../../shared/transparent-background/transparent-background.component';
import { UserProfile } from '../../../interfaces/userProfile';
import { UserViewSmallComponent } from '../../../shared/user-view-small/user-view-small.component';
import { ResizeService } from '../../../services/responsive/resize.service';

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
  selectedUserIdSig = signal<string>('');
  directmessagesOpen: boolean = true;

  constructor(private chatService: ChatsService, private router: Router, private resize: ResizeService) {
    effect(() => {
      if (this.usersDb.currentUser?.channelFriendHighlighted) {
        this.selectedUserIdSig.set(this.usersDb.currentUser.channelFriendHighlighted);
      }
    })
  }

  openDirectmessages() {
    if (this.directmessagesOpen) {
      this.directmessagesOpen = false;
    } else {
      this.directmessagesOpen = true;
    }
  }


  selectUser(id: string) {
    this.usersDb.updateChanelFriendHighlighted(id);
    this.selectedUserIdSig.set(id);
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


  async selectChat(user: UserProfile) {
    try {
      const chatId = await this.chatService.setPrivateChat(user, "messages");
      this.chatService.currentChatId = chatId;
      this.resize.checkSiteWidth(960);
      this.router.navigate(['/chatroom', {outlets: {chats: ['direct-message', chatId], thread: null}}]);
    } catch (error) {
      console.error('Fehler beim Erstellen des Chats:', error);
    }
  }
}
