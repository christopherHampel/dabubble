import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DevspaceDirectmessagesComponent } from '../devspace-directmessages.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
  userName: string = '';
  users: string[] = [
    'Christopher',
    'Stephan',
    'Theo',
    'Sabine',
    'Helga'
  ]

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
