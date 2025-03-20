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
import { doc, onSnapshot } from 'firebase/firestore';

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
    public searchService: SearchDevspaceService,
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
    const threadData = await this.searchService.getThreadData(resultData);
    const channel = 'channel';
    if (resultData.originalChat == 'channels') {
      this.router.navigate([
        '/chatroom',
        { outlets: { chats: [channel, threadData.chatId], thread: null } },
      ]);
    } else {
      this.router.navigate([
        '/chatroom',
        { outlets: { chats: ['direct-message', threadData.chatId], thread: null } },
      ]);
    }
    setTimeout(() => {
      this.chatService.subscribeFirstThreadMessage(
        threadData.chatId,
        resultData.originalChatInfo.originalChatId,
        resultData.originalChatInfo.originalChat
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

  getChatIcon(result:any) {    
    if(result.searchResult.component === 'channels') {
      return '#'
    } else if(result.searchResult.component === 'threads') {
      let originalComponent = this.getOriginalComponent(result);
      return originalComponent
    } else {
      return '@'
    }
  }

  getChatPartner(result:any) {
    const resultData = result.searchResult;    
    
    if(resultData.component == 'channels') {
      return resultData.chatPartner.chatPartner;
    } else if(resultData.component == 'messages') {
      let chatPartner = this.checkChatPartner(resultData.chatPartner.chatPartner, resultData.chatPartner.currentUser);
      return chatPartner;
    } else {      
      const data = resultData.originalChatInfo.originalChatName
      const originalText = resultData.originalChatInfo.originalMessage;
      let chatPartner = this.checkChatPartner(data.chatPartner, data.currentUser);
      return chatPartner + ' ' + 'Thread von Nachricht:' + originalText;
    }
  }

  checkChatPartner(chatPartner: string, storedUser:string) {
    const currentUser = this.usersDb.currentUserSig()?.userName;
    return currentUser === storedUser ? chatPartner : storedUser;
  }

  getOriginalComponent(result:any) {
    if(result.searchResult.originalChatInfo.originalChat == 'channels') {
      return '#'
    } else {
      return '@'
    }
  }
}