import { Component, EventEmitter, inject, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddFriendDialogComponent } from './add-friend-dialog/add-friend-dialog.component';
import { CommonModule } from '@angular/common';
import { ChatsService } from '../../../services/messages/chats.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-devspace-directmessages',
  imports: [ CommonModule ],
  templateUrl: './devspace-directmessages.component.html',
  styleUrl: './devspace-directmessages.component.scss'
})
export class DevspaceDirectmessagesComponent {

  readonly dialog = inject(MatDialog);

  constructor(private chatService: ChatsService, private router: Router) {  }

  names = ['Alice', 'Bob', 'Charlie', 'Max'];

  openDialog(): void {
    const dialogRef = this.dialog.open(AddFriendDialogComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {
      }
    });
  }

  async selectName(name: string) {
    const chatId = await this.chatService.setPrivateChat(name);
    this.router.navigate([`/chatroom/direct-message/${chatId}`]);
  }
}
