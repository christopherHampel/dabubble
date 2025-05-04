import {Component, effect, inject, signal, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {ChatsService} from '../../../services/message/chats.service';
import {UsersDbService} from '../../../services/usersDb/users-db.service';
import {AddFriendDialogComponent} from './add-friend-dialog/add-friend-dialog.component';
import {UserProfile} from '../../../interfaces/userProfile';
import {UserViewSmallComponent} from '../../../shared/user-view-small/user-view-small.component';
import {ResizeService} from '../../../services/responsive/resize.service';
import {TransparentBackgroundComponent} from '../../../shared/transparent-background/transparent-background.component';
import {DialogWindowControlService} from '../../../services/dialog-window-control/dialog-window-control.service';

@Component({
  selector: 'app-devspace-directmessages',
  imports: [
    CommonModule,
    AddFriendDialogComponent,
    UserViewSmallComponent,
    TransparentBackgroundComponent
  ],
  templateUrl: './devspace-directmessages.component.html',
  styleUrl: './devspace-directmessages.component.scss'
})
export class DevspaceDirectmessagesComponent {
  usersDb = inject(UsersDbService);
  dialogWindowControl = inject(DialogWindowControlService);

  directmessagesOpen: boolean = true;
  flag: boolean = true;
  getLocalUserList: UserProfile[] = [];

  selectedUserIdSig = signal<string>('');

  @ViewChild('addFriend') addFriend!: any;

  constructor(private chatService: ChatsService, private router: Router, private resize: ResizeService) {
    effect(() => {
      if (this.usersDb.currentUser?.channelFriendHighlighted) {
        this.selectedUserIdSig.set(this.usersDb.currentUser.channelFriendHighlighted);
      }

      this.loadUserList();

      if (this.usersDb.triggerAddUserIdSig()) {
        this.selectUser(this.usersDb.triggerAddUserIdSig());
      }
    })
  }


  addUser(event: boolean) {
    this.flag = event;

    setTimeout(() => this.loadUserList(), 250);
  }


  loadUserList() {
    if (this.flag) this.getLocalUserList = this.usersDb.userList;
    setTimeout(() => this.flag = false, 2500);
  }


  openDirectmessages() {
    this.directmessagesOpen = !this.directmessagesOpen;
  }


  selectUser(id: string) {
    this.usersDb.updateChanelFriendHighlighted(id);
    this.selectedUserIdSig.set(id);
  }


  openAddFriendDialog() {
    this.dialogWindowControl.openDialog('addFriend');
    this.addFriend.focusInput();
  }


  isDialogOpen() {
    return this.dialogWindowControl.isAddFriendOpen
  }


  getUserList() {
    if (this.usersDb.currentUser) {
      return this.getLocalUserList.filter(user => this.usersDb.currentUser!.directmessagesWith.includes(user.id));
    } else {
      return [];
    }
  }


  async selectChat(user: UserProfile) {
    try {
      const chatId = await this.chatService.setPrivateChat(user, "messages");
      this.chatService.currentChatId = chatId;
      this.resize.checkSiteWidth(960);
      this.router.navigate(['/chatroom', {outlets: {chats: ['direct-message', chatId], thread: null}}]);
    } catch (error) {
      console.error('Fehler beim Erstellen des Chats:', error);
    }
  }
}
