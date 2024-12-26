import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { DevspaceDirectmessagesComponent } from '../devspace-directmessages.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsersDbService } from '../../../../services/usersDb/users-db.service';

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
  users: string[] = [
    'Christopher',
    'Stephan',
    'Theo',
    'Sabine',
    'Helga'
  ]

  getUserList() {
    return this.usersDb.userListSig();
  }

  filterUserName(currentUser: string): boolean {
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
