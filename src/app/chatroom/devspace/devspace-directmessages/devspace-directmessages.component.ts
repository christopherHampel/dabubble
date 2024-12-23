import { Component, EventEmitter, inject, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddFriendDialogComponent } from './add-friend-dialog/add-friend-dialog.component';

@Component({
  selector: 'app-devspace-directmessages',
  imports: [],
  templateUrl: './devspace-directmessages.component.html',
  styleUrl: './devspace-directmessages.component.scss'
})
export class DevspaceDirectmessagesComponent {

  readonly dialog = inject(MatDialog);
  @Output() userSelected = new EventEmitter<string>();

  onUserClick(username: string): void {
    this.userSelected.emit(username);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddFriendDialogComponent, {
      
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        //this.animal.set(result);
      }
    });
  }
}
