import { Component, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsersDbService } from '../../../../services/usersDb/users-db.service';
import { UserProfile } from '../../../../interfaces/userProfile';
import { ChatsService } from '../../../../services/message/chats.service';
import { Router } from '@angular/router';
import { AddPeopleInputComponent } from '../../../../shared/add-people-input/add-people-input.component';
import { DialogWindowControlService } from '../../../../services/dialog-window-control/dialog-window-control.service';
import { ResizeService } from '../../../../services/responsive/resize.service';

@Component({
  selector: 'app-add-friend-dialog',
  imports: [
    FormsModule,
    CommonModule,
    AddPeopleInputComponent
  ],
  templateUrl: './add-friend-dialog.component.html',
  styleUrl: './add-friend-dialog.component.scss'
})
export class AddFriendDialogComponent {
  private usersDb = inject(UsersDbService);
  private chatService = inject(ChatsService);
  dialogWindowControl = inject(DialogWindowControlService);
  resize = inject(ResizeService);

  selectedUser: UserProfile = {} as UserProfile;
  mobileClose: boolean = false;
  startChatWithoutAddUser: boolean = false;

  @Output() loadUserList = new EventEmitter<boolean>();
  @ViewChild('addPeopleInput') addPeopleInput!: any;

  constructor(private router: Router) { }


  focusInput() {
    setTimeout(() => this.addPeopleInput.focusInput(), 500)
  }


  selectUser(event: any) {
    this.selectedUser = event;
  }


  closeAddFriendDialog() {
    this.mobileClose = true;

    setTimeout(() => {
      this.mobileClose = false;
      this.dialogWindowControl.closeDialog('addFriend');
    }, 500)
  }


  async startChat() {
    try {
      const chatId = await this.chatService.setPrivateChat(this.selectedUser, 'messages');
      this.chatService.currentChatId = chatId;
      this.router.navigate(['/chatroom', {outlets: {chats: ['direct-message', chatId]}}]);
      if (!this.startChatWithoutAddUser) await this.usersDb.addDirectMessageWith(this.selectedUser['id']);
      this.closeAddFriendDialog();
      this.loadUserList.emit(true);
    } catch (error) {
      console.error('Fehler beim Erstellen des Chats:', error);
    }
  }

  protected readonly close = close;
}
