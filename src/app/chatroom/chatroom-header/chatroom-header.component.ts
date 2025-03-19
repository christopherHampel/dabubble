import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { UsersDbService } from '../../services/usersDb/users-db.service';
import { Router } from '@angular/router';
import { TransparentBackgroundComponent } from '../../shared/transparent-background/transparent-background.component';
import { FormsModule } from '@angular/forms';
import { SearchDevspaceService } from '../../services/message/search-devspace.service';
import { ThreadsDbService } from '../../services/message/threads-db.service';
import { ChatsService } from '../../services/message/chats.service';
import { SingleMessageComponent } from '../messages/single-message/single-message.component';

@Component({
  selector: 'app-chatroom-header',
  imports: [
    CommonModule,
    TransparentBackgroundComponent,
    FormsModule,
    SingleMessageComponent,
  ],
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
    const resultData = result.searchResult;
    if (resultData.component === 'channels') {
      this.navigateTo(resultData, 'channel');
    } else if (resultData.component === 'messages') {
      this.navigateTo(resultData, 'direct-message');
    } else {
      this.goToThreads(resultData);
    }
    this.searchTextInput = '';
    this.searchService.results = [];
  }

  navigateTo(resultData:any, component:string) {
    this.router.navigate([
      '/chatroom',
      { outlets: { chats: [component, resultData.channelId], thread: null } },
    ]);
  }

  async goToThreads(resultData: any) {
    const chatId = await this.searchService.getThreadData(resultData);
    const channel = 'channel';
    if (resultData.originalChat == 'channels') {
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
      this.chatService.subscribeFirstThreadMessage(
        chatId,
        resultData.originalChatId,
        resultData.originalChat
      );
      this.threadsDb.currentThreadId.set(resultData.channelId);
      this.threadsDb.subscribeToThread(resultData.channelId);
      this.threadsDb.subMessageList(resultData.channelId);

      this.router.navigate([
        '/chatroom',
        { outlets: { thread: ['thread', resultData.channelId] } },
      ]);
    }, 100);
  }
}
