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
import { ChannelsDbService } from '../../../services/message/channels-db.service';
import { Channel } from '../../../interfaces/channel';

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
  channelList: boolean = false;
  searchText: string = '';
  filteredUser: any[] = [];
  filteredChannels: any[] = [];

  constructor(
    private userService: UsersDbService,
    private chatService: ChatsService,
    private router: Router,
    private channelsDb: ChannelsDbService
  ) {}

  ngOnInit() {
    setTimeout(() => {
      this.isLoaded = true;
    }, 50);
  }

  searchChat() {
    if (this.searchText.startsWith('#')) {
      this.channelList = true;
      this.searchChannels();
    } else if (this.searchText.startsWith('@')) {
      this.userList = true;
      this.searchUserList();
    } else if (this.searchText) {
      this.userList = true;
      this.searchByEmail();
    } else {
      this.userList = false;
      this.channelList = false;
    }
  }

  searchUserList() {
    const query = this.searchText.substring(1).toLowerCase();
    this.filteredUser = this.userService.userList.filter((user) =>
      user.userName.toLowerCase().includes(query)
    );
  }

  searchByEmail() {
    const query = this.searchText.toLowerCase();
    this.filteredUser = this.userService.userList.filter((user) =>
      user.email.toLowerCase().includes(query)
    );
  }

  searchChannels() {
    const query = this.searchText.substring(1).toLowerCase();
    const channels = this.getChannelList();
    this.filteredChannels = [];

    for (let i = 0; i < channels.length; i++) {
      if (channels[i].name.toLowerCase().includes(query)) {
        this.filteredChannels.push(channels[i]);
      }
    }
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

  selectChannel(channel: Channel) {
    this.router.navigate([
      '/chatroom',
      { outlets: { chats: ['channel', channel.id], thread: null } },
    ]);
  }

  getChannelList() {
    return this.channelsDb.channelList;
  }
}
