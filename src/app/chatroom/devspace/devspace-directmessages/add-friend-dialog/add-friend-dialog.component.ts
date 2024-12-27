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
    CommonModule
  ],
  templateUrl: './add-friend-dialog.component.html',
  styleUrl: './add-friend-dialog.component.scss'
})
export class AddFriendDialogComponent {
  readonly dialogRef = inject(MatDialogRef<DevspaceDirectmessagesComponent>);
  usersDb = inject(UsersDbService)
  userName: string = '';
  userExistList: UserProfile[] = [{
    id: '',
    userName: '',
    email: '',
    avatar: '',
    active: false
  }];
  selectedUser: UserProfile = {};

  getUserList() {
    return this.usersDb.userListSig();
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
      active: user.active
    }
    this.userName = '';
  }

  filteredUsersAfterInput() {
    return this.getUserList().filter(() => this.filterUserExist(this.userName));
  }

  filterUserExist(currentUser: string): boolean {
    if (!this.userName) {
      return false;
    } else {
      return currentUser.toLocaleLowerCase().startsWith(this.userName.toLocaleLowerCase());
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
