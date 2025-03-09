import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TextareaComponent } from '../../../shared/textarea/textarea.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserViewSmallComponent } from '../../../shared/user-view-small/user-view-small.component';
import { UsersDbService } from '../../../services/usersDb/users-db.service';
import { UserProfile } from 'firebase/auth';
import { ChatsService } from '../../../services/message/chats.service';
import { Router } from '@angular/router';
import { User } from '../../../interfaces/user';

@Component({
  selector: 'app-default',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    TextareaComponent,
    CommonModule,
    FormsModule,
    UserViewSmallComponent,
  ],
  templateUrl: './default.component.html',
  styleUrl: './default.component.scss',
})
export class DefaultComponent {
  isLoaded = false;
  userList: boolean = false;
  searchText: string = '';
  filteredUser: any[] = [];

  constructor(
    private userService: UsersDbService,
    private chatService: ChatsService,
    private router: Router
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.isLoaded = true;
    }, 50);
  }

  searchChat() {
    if (this.searchText == '#') {
      console.log('Piep');
    } else if (this.searchText.startsWith('@')) {
      this.userList = true;
      this.searchUserList();
      console.log(this.filteredUser);
    } else {
      this.userList = false;
    }
  }

  searchUserList() {
    const query = this.searchText.substring(1);

    this.filteredUser = this.userService.userList.filter((user) =>
      user.userName.includes(query)
    );
  }

  async selectChat(user: any) {
    try {
      const chatId = await this.chatService.setPrivateChat(user, 'messages');
      this.chatService.currentChatId = chatId;
      this.router.navigate([
        '/chatroom',
        { outlets: { chats: ['direct-message', chatId], thread: null } },
      ]);
    } catch (error) {
      console.error('Fehler beim Erstellen des Chats:', error);
    }
  }
}
