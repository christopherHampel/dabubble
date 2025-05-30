import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { UsersDbService } from '../../services/usersDb/users-db.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SearchDevspaceService } from '../../services/message/search-devspace.service';
import { ThreadsDbService } from '../../services/message/threads-db.service';
import { ChatsService } from '../../services/message/chats.service';
import { UserProfilComponent } from '../../shared/user-profil/user-profil.component';
import { UserProfile } from '../../interfaces/userProfile';
import { TransparentBackgroundComponent } from '../../shared/transparent-background/transparent-background.component';
import {DialogWindowControlService} from '../../services/dialog-window-control/dialog-window-control.service';

@Component({
  selector: 'app-chatroom-header',
  imports: [
    CommonModule,
    FormsModule,
    UserProfilComponent,
    TransparentBackgroundComponent
  ],
  templateUrl: './chatroom-header.component.html',
  styleUrl: './chatroom-header.component.scss',
})
export class ChatroomHeaderComponent {
  private auth = inject(AuthService);
  usersDb = inject(UsersDbService);
  dialogWindowControl = inject(DialogWindowControlService);

  searchTextInput: string = '';
  userProfil: boolean = false;

  searchText = signal<string>('');
  results = signal<any[]>([]);
  userSig = signal<UserProfile>({} as UserProfile);
  hideUserProfilSig = signal<boolean>(true);

  constructor(
    private router: Router,
    public searchService: SearchDevspaceService,
    private threadsDb: ThreadsDbService,
    private chatService: ChatsService
  ) { }

  get resultsData() {
    return this.searchService.results;
  }

  openUserProfilDialog(user: UserProfile) {
    this.dialogWindowControl.openDialog('userProfil');
    this.userSig.set(user);
    this.userProfil = true;

    setTimeout(() => this.hideUserProfilSig.set(false), 250);
  }

  closeUserProfilDialog(event: boolean) {
    this.userProfil = event;
    this.hideUserProfilSig.set(true);
  }

  isDialogOpen() {
    return this.dialogWindowControl.isDropdownOpen;
  }

  openDropdown() {
    this.dialogWindowControl.openDialog('dropdown');
  }

  onLogout() {
    if (this.usersDb.currentUser) {
      this.dialogWindowControl.resetDialogs();
      this.usersDb.updateUserStatus(this.usersDb.currentUser.id, false);
      this.usersDb.updateChanelFriendHighlighted('');
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
    if (resultData.originalChatInfo.originalChat == 'channels') {
      this.router.navigate([
        '/chatroom',
        { outlets: { chats: ['channel', threadData.chatId], thread: null } },
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

  get() {
    if(this.searchService.isLoading() || this.resultsData.length > 0) {
      return 'search-results'
    } else {
      return ''
    }
  }
}
