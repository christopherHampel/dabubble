import { Component, effect, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserViewSmallComponent } from '../../../../shared/user-view-small/user-view-small.component';
import { ChannelsDbService } from '../../../../services/message/channels-db.service';
import { UsersDbService } from '../../../../services/usersDb/users-db.service';
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

  constructor() {
    effect(() => {
      this.channelUserDataListReverse = [];

      this.channelsDb.channelUserDataList.forEach(userData => {
        this.channelUserDataListReverse.unshift(userData);
      });
    });
  }
}
