import { Component, ElementRef, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsersDbService } from '../../../../services/usersDb/users-db.service';
import { User, UserProfile } from 'firebase/auth';
import { ChatsService } from '../../../../services/message/chats.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-friend-dialog',
  imports: [
    FormsModule,
    CommonModule,
  ],
  templateUrl: './add-friend-dialog.component.html',
  styleUrl: './add-friend-dialog.component.scss'
})
export class AddFriendDialogComponent {
  private usersDb = inject(UsersDbService);
  private chatService = inject(ChatsService);
  userName: string = '';
  selectedUser: UserProfile = {} as UserProfile;
  @Input() dialogOpen: boolean = false;
  @Output() dialogClose = new EventEmitter<boolean>();
  @ViewChild('inputField') inputFieldRef!: ElementRef<HTMLInputElement>;

  constructor(private router: Router) { }

  ngOnChanges() {
    if (this.dialogOpen) {
      this.focusInput();
    }
  }

  focusInput() {
    setTimeout(() => this.inputFieldRef.nativeElement.focus(), 50);
  }

  closeDialog() {
    this.dialogOpen = false;
    this.dialogClose.emit(true);
    this.resetUserName();
    this.resetSelectedUser();
  }

  getUserList() {
    if (this.usersDb.currentUser) {
      return this.usersDb.userList.filter(user =>
        user.id != this.usersDb.currentUser!.id &&
        !this.usersDb.currentUser!.directmessagesWith.includes(user.id));
    } else {
      return [];
    }
  }

  removeUser() {
    this.selectedUser = {};
    this.focusInput();
  }

  selectUser(id: string | undefined) {
    const user: any = this.getUserList().find(user => user.id == id);
    this.selectedUser = {
      id: user.id,
      userName: user.userName,
      email: user.emai,
      avatar: user.avatar,
      active: user.active,
      directmessages: user.directmessages
    }

    this.resetUserName();
  }

  filteredUsersAfterInput() {
    if (!this.userName) {
      return [];
    } else {
      return this.getUserList().filter(user => user.userName.toLocaleLowerCase().startsWith(this.userName.toLocaleLowerCase()));
    }
  }

  filteredUserForDropdown(currentUser: string): boolean {
    if (!this.userName) {
      return false;
    } else {
      return currentUser.toLocaleLowerCase().startsWith(this.userName.toLocaleLowerCase());
    }
  }

  resetUserName() {
    this.userName = '';
  }

  resetSelectedUser() {
    this.selectedUser = {};
  }

  async startChat() {
    try {
      const chatId = await this.chatService.setPrivateChat(this.selectedUser as any);
      this.chatService.currentChatId = chatId;
      this.router.navigate([`/chatroom/direct-message/${chatId}`]);
      await this.usersDb.addDirectMessageWith(this.selectedUser['id'] as string);
      this.closeDialog();
    } catch (error) {
      console.error('Fehler beim Erstellen des Chats:', error);
    }
  }
}
