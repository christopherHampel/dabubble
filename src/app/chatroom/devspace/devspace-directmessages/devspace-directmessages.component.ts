import { Component, EventEmitter, inject, Output } from '@angular/core';
import { AddFriendDialogComponent } from './add-friend-dialog/add-friend-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-devspace-directmessages',
  imports: [],
  templateUrl: './devspace-directmessages.component.html',
  styleUrl: './devspace-directmessages.component.scss'
})
export class DevspaceDirectmessagesComponent {
  dialog = inject(MatDialog);
  @Output() userSelected = new EventEmitter<string>();

  onUserClick(username: string): void {
    this.userSelected.emit(username);
  }

  openDialog(): void {
    this.dialog.open(AddFriendDialogComponent);
  }
}
