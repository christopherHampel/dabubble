import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { UserViewSmallComponent } from '../../../../shared/user-view-small/user-view-small.component';
import { FormsModule } from '@angular/forms';
import { UsersDbService } from '../../../../services/usersDb/users-db.service';
import { ChatsService } from '../../../../services/message/chats.service';
import { ChannelsDbService } from '../../../../services/message/channels-db.service';
import { Channel } from '../../../../interfaces/channel';
import { Router } from '@angular/router';
import { ResizeService } from '../../../../services/responsive/resize.service';

@Component({
  selector: 'app-search-field',
  imports: [CommonModule, FormsModule, UserViewSmallComponent],
  templateUrl: './search-field.component.html',
  styleUrl: './search-field.component.scss',
})
export class SearchFieldComponent {
  searchText: string = '';
  userList: boolean = false;
  channelList: boolean = false;
  filteredUser: any[] = [];
  filteredChannels: any[] = [];
  isLoaded = false;

  @Input() placeholder:string = '';

  constructor(
    private userService: UsersDbService,
    private chatService: ChatsService,
    private channelsDb: ChannelsDbService,
    private router: Router,
    private resize: ResizeService
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

  getChannelList() {
    return this.channelsDb.channelList;
  }

  async selectChat(user: any) {
    try {
      this.resize.checkSiteWidth(960);
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
    this.resize.checkSiteWidth(960);
    this.router.navigate([
      '/chatroom',
      { outlets: { chats: ['channel', channel.id], thread: null } },
    ]);
  }
}
