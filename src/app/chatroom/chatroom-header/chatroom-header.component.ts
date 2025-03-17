import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { UsersDbService } from '../../services/usersDb/users-db.service';
import { Router } from '@angular/router';
import { TransparentBackgroundComponent } from '../../shared/transparent-background/transparent-background.component';
import { FormsModule } from '@angular/forms';
import { ChannelsDbService } from '../../services/message/channels-db.service';
import { SearchDevspaceService } from '../../services/message/search-devspace.service';
import { doc } from 'firebase/firestore';
import { ThreadsDbService } from '../../services/message/threads-db.service';
import { ChatsService } from '../../services/message/chats.service';

@Component({
  selector: 'app-chatroom-header',
  imports: [CommonModule, TransparentBackgroundComponent, FormsModule],
  templateUrl: './chatroom-header.component.html',
  styleUrl: './chatroom-header.component.scss',
})
export class ChatroomHeaderComponent {
  private auth = inject(AuthService);
  usersDb = inject(UsersDbService);
  dropdown: boolean = false;
  searchTextInput: string = '';

  searchText = signal<string>('');
  results = signal<any[]>([]);

  constructor(
    private router: Router,
    private searchService: SearchDevspaceService,
    private threadsDb: ThreadsDbService,
    private chatService: ChatsService
  ) {}

  get resultsData() {
    return this.searchService.results;
  }

  openDropdown() {
    this.dropdown = true;
  }

  closeDropdown(event: boolean) {
    this.dropdown = event;
  }

  onLogout() {
    if (this.usersDb.currentUser) {
      this.usersDb.updateUserStatus(this.usersDb.currentUser.id, false);
      this.usersDb.updateClickStatus(this.usersDb.currentUser.id, false);
      this.auth.logout();
      this.router.navigateByUrl('/register/login');
    }
  }

  searchDevspace() {
    this.searchService.setSearchText(this.searchTextInput);
  }

  async goToSearchResult(result: any) {
    console.log(result);
    debugger
    if (result.component === 'channels') {
      this.router.navigate([
        '/chatroom',
        { outlets: { chats: ['channel', result.channelId], thread: null } },
      ]);
    } else if (result.component === 'messages') {
      this.router.navigate([
        '/chatroom',
        {
          outlets: {
            chats: ['direct-message', result.channelId],
            thread: null,
          },
        },
      ]);
    } else {
      const chatId = await this.searchService.getThreadData(result);
      const channel = 'channel';
      debugger
      if(result.originalChat == 'channels') {
        this.router.navigate([
          '/chatroom',
          { outlets: { chats: [channel, chatId], thread: null } },
        ]);
      } else {
        this.router.navigate([
          '/chatroom',
          { outlets: { chats: ['direct-message', chatId], thread: null } },
        ]);
      }
      setTimeout(() => {                
        this.chatService.subscribeFirstThreadMessage(chatId, result.originalChatId, result.originalChat);
        this.threadsDb.currentThreadId.set(result.channelId);
        this.threadsDb.subscribeToThread(result.channelId);
        this.threadsDb.subMessageList(result.channelId);        
        
        this.router.navigate([
          '/chatroom',
          { outlets: { thread: ['thread', result.channelId] } },
        ]);
      }, 100);
    }
    this.searchTextInput = '';
    this.searchService.results = [];
  }
}
