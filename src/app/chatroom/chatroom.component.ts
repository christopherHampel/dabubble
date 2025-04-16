import {Component, effect, inject, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevspaceComponent } from './devspace/devspace.component';
import { MessagesComponent } from './messages/messages.component';
import { ThreadRouterOutletComponent } from './threads/thread-router-outlet/thread-router-outlet.component';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { UsersDbService } from '../services/usersDb/users-db.service';
import { ChatroomHeaderComponent } from './chatroom-header/chatroom-header.component';
import { ResizeService } from '../services/responsive/resize.service';
import { DialogWindowControlService } from '../services/dialog-window-control/dialog-window-control.service';
import { TransparentBackgroundComponent } from '../shared/transparent-background/transparent-background.component';
import { UserProfilComponent } from '../shared/user-profil/user-profil.component';
import {UserProfile} from '../interfaces/userProfile';

@Component({
  selector: 'app-chatroom',
  imports: [
    CommonModule,
    DevspaceComponent,
    MessagesComponent,
    ThreadRouterOutletComponent,
    ChatroomHeaderComponent,
    TransparentBackgroundComponent,
    UserProfilComponent
  ],
  templateUrl: './chatroom.component.html',
  styleUrl: './chatroom.component.scss'
})
export class ChatroomComponent {
  currentUser: string = '';

  private auth = inject(AuthService);
  userDb = inject(UsersDbService);
  dialogWindowControl = inject(DialogWindowControlService);

  userSig = signal<UserProfile>({} as UserProfile);

  editProfile:boolean = false;
  userProfil: boolean = false;

  constructor(private router: Router, private resize: ResizeService, private usersDb: UsersDbService) { }

  ngOnInit() {
    this.auth.currentAuthUser.subscribe((user) => {
      if (user) {
        this.userDb.updateUserStatus(user.uid, true);
      } else {
        this.router.navigateByUrl('/register/login');
      }
    })
  }

  onUserSelected(username: string): void {
    this.currentUser = username;
  }

  under1000px() {
    this.resize.checkScreenSize(960);
    return this.resize.isSmallScreen
  }

  goBackDevspace() {
    this.resize.setZIndexChats(false);
  }

  get zIndexChats() {
    return this.resize.zIndexChats();
  }

  get getCurrentUserImage(): string {
    return this.usersDb.currentUserSig()?.avatar || '';
  }

  get wrapperMobile() {
    return this.resize.wrapperMobile()
  }

  get thisThreads() {
    return this.resize.thisThreads();
  }

  openMobileWrapper() {
    this.resize.setMobileWrapper(!this.resize.wrapperMobile());
  }

  openUserProfilDialog(user: UserProfile) {
    this.dialogWindowControl.openDialog('userProfil');
    this.userSig.set(user);
    this.userProfil = true;
  }

  closeUserProfilDialog(event: boolean) {
    this.userProfil = event;
  }

  logout() {
    if (this.usersDb.currentUser) {
      this.usersDb.updateUserStatus(this.usersDb.currentUser.id, false);
      this.usersDb.updateChanelFriendHighlighted('');
      this.auth.logout();
      this.router.navigateByUrl('/register/login');
      this.openMobileWrapper();
    }
  }

  // checkWindowWidth(value:number) {
  //   return window.innerWidth < value;
  // }
}
