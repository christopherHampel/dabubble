import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DevspaceDirectmessagesComponent } from '../devspace-directmessages.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsersDbService } from '../../../../services/usersDb/users-db.service';
import { UserProfile } from 'firebase/auth';

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
  readonly dialogRef = inject(MatDialogRef<DevspaceDirectmessagesComponent>);
  private usersDb = inject(UsersDbService)
  userName: string = '';
  selectedUser: UserProfile = {};

  getUserList() {
    return this.usersDb.userList.filter(user => user.id != this.usersDb.currentUser.id && !this.usersDb.currentUser.directmessages.includes(user.id));
  }

  removeUser() {
    this.selectedUser = {};
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

  async startChat(id: any) {
    await this.usersDb.addDirectMessage(id);
    this.closeDialog();
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
