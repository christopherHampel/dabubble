import { Component, effect, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserViewSmallComponent } from '../../../../shared/user-view-small/user-view-small.component';
import { ChannelsDbService } from '../../../../services/message/channels-db.service';
import { UserProfile } from '../../../../interfaces/userProfile';

@Component({
  selector: 'app-channel-members-info',
  imports: [
    CommonModule,
    UserViewSmallComponent
  ],
  templateUrl: './channel-members-info.component.html',
  styleUrl: './channel-members-info.component.scss'
})
export class ChannelMembersInfoComponent {
  channelsDb = inject(ChannelsDbService);
  channelUserDataListReverse: UserProfile[] = [];

  @Input() dialogOpen: boolean = false;
  @Output() dialogClose = new EventEmitter<boolean>();
  @Output() addMembersOpen = new EventEmitter<boolean>();

  constructor() {
    effect(() => {
      this.channelUserDataListReverse = [];

      this.channelsDb.channelUserDataList.forEach(userData => {
        this.channelUserDataListReverse.unshift(userData);
      });
    });
  }


  openAddMembers() {
    this.addMembersOpen.emit(true);
  }


  closeDialog() {
    this.dialogOpen = false;
    this.dialogClose.emit(true);
  }
}