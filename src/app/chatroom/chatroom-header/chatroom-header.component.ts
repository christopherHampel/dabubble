import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { UsersDbService } from '../../services/usersDb/users-db.service';
import { Router } from '@angular/router';
import { TransparentBackgroundComponent } from '../../shared/transparent-background/transparent-background.component';
import { FormsModule } from '@angular/forms';
import { ChannelsDbService } from '../../services/message/channels-db.service';
import { SearchDevspaceService } from '../../services/message/search-devspace.service';

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
  searchTextInput:string = '';

  searchText = signal<string>('');
  results = signal<any[]>([]);

  constructor(
    private router: Router,
    private searchService: SearchDevspaceService
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

  goToSearchResult(result:any) {
    if(result.component === 'channels') {
        this.router.navigate(['/chatroom', { outlets: { chats: ['channel', result.channelId], thread: null } }]); 
    } else if(result.component === 'messages') {
      this.router.navigate(['/chatroom', {outlets: {chats: ['direct-message', result.channelId], thread: null}}]);
    } else {
      console.log('Go to threads');
      // this.router.navigate(['/chatroom', { outlets: { thread: ['thread', this.threadsDb.currentThreadId()] } }]);
    }
    this.searchTextInput = '';
    this.searchService.results = [];
  }
}
