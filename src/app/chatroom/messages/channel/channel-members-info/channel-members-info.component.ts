import { Component, effect, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserViewSmallComponent } from '../../../../shared/user-view-small/user-view-small.component';
import { ChannelsDbService } from '../../../../services/message/channels-db.service';
import { UserProfile } from '../../../../interfaces/userProfile';
import { UserProfilComponent } from '../../../../shared/user-profil/user-profil.component';
import { UsersDbService } from '../../../../services/usersDb/users-db.service';
import { DialogWindowControlService } from '../../../../services/dialog-window-control/dialog-window-control.service';

@Component({
  selector: 'app-channel-members-info',
  imports: [
    CommonModule,
    UserViewSmallComponent,
    UserProfilComponent
  ],
  templateUrl: './channel-members-info.component.html',
  styleUrl: './channel-members-info.component.scss'
})
export class ChannelMembersInfoComponent {
  channelsDb = inject(ChannelsDbService);
  usersDb = inject(UsersDbService);
  dialogWindowControl = inject(DialogWindowControlService);

  channelUserDataListReverse: UserProfile[] = [];

  userSig = signal<UserProfile>({} as UserProfile);
  hideUserProfilSig = signal<boolean>(true);

  @Input() userProfil: boolean = false;
  @Output() addMembersDialogFocus = new EventEmitter<boolean>();

  constructor() {
    effect(() => {
      this.channelUserDataListReverse = [];

      this.channelsDb.channelUserDataList.forEach(userData => {
        this.channelUserDataListReverse.unshift(userData);
      });
    });
  }


  openAddMembers() {
    this.dialogWindowControl.closeDialog('membersInfo');
    this.dialogWindowControl.openDialog('addMembers');
    this.addMembersDialogFocus.emit(true);
  }


  closeMembersInfoDialog() {
    this.dialogWindowControl.closeDialog('membersInfo');
  }


  openUserProfilDialog(user: UserProfile){
    this.userSig.set(user);
    this.userProfil = true;
    this.dialogWindowControl.openDialog('userProfil');

    setTimeout(() => this.hideUserProfilSig.set(false), 250)
  }

  closeUserProfilDialog(event: boolean) {
    this.userProfil = event;
    this.hideUserProfilSig.set(true);
  }


  isDialogOpen() {
    return this.dialogWindowControl.isUserProfilOpen;
  }
}
