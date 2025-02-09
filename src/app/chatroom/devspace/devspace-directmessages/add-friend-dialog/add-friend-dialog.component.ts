import { Component, ElementRef, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsersDbService } from '../../../../services/usersDb/users-db.service';
import { UserProfile } from '../../../../interfaces/userProfile';
import { ChatsService } from '../../../../services/message/chats.service';
import { Router } from '@angular/router';
import { AddPeopleInputComponent } from '../../../../shared/add-people-input/add-people-input.component';
import { coerceStringArray } from '@angular/cdk/coercion';

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
  selectedUser: UserProfile = {} as UserProfile;
  @Input() dialogOpen: boolean = false;
  @Output() dialogClose = new EventEmitter<boolean>();
  @ViewChild('addPeopleInput') addPeopleInput!: any;

  constructor(private router: Router) { }

  ngOnChanges() {
    if (this.dialogOpen) {
      this.focusInput();
    }
  }

  focusInput() {
    this.addPeopleInput.focusInput();
  }

  selectUser(event: any) {
    this.selectedUser = event;
  }

  closeDialog() {
    this.dialogOpen = false;
    this.dialogClose.emit(true);
  }

  async startChat() {
    try {
      const chatId = await this.chatService.setPrivateChat(this.selectedUser);
      this.chatService.currentChatId = chatId;
      this.router.navigate([`/chatroom/direct-message/${chatId}`]);
      await this.usersDb.addDirectMessageWith(this.selectedUser['id']);
      this.closeDialog();
    } catch (error) {
      console.error('Fehler beim Erstellen des Chats:', error);
    }
  }
}
