import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserViewSmallComponent } from '../../../../shared/user-view-small/user-view-small.component';
import { ChannelsDbService } from '../../../../services/message/channels-db.service';
import { UsersDbService } from '../../../../services/usersDb/users-db.service';

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
  usersDb = inject(UsersDbService);

  @Input() dialogOpen: boolean = false;
}
