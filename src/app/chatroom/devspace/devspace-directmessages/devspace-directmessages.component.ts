import { Component, EventEmitter, inject, Output } from '@angular/core';
import { AddFriendDialogComponent } from './add-friend-dialog/add-friend-dialog.component';
import { MatDialog } from '@angular/material/dialog';
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
  dialog = inject(MatDialog);
  @Output() userSelected = new EventEmitter<string>();

  readonly dialog = inject(MatDialog);

  constructor(private chatService: ChatsService, private router: Router) {  }

  names = ['Alice', 'Bob', 'Charlie', 'Max'];

  openDialog(): void {
    this.dialog.open(AddFriendDialogComponent);
  }

  async selectName(name: string) {
    const chatId = await this.chatService.setPrivateChat(name);
    this.router.navigate([`/chatroom/direct-message/${chatId}`]);
  }
}
