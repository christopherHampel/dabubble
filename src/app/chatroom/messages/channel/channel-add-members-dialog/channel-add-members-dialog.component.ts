import { Component, ViewChild } from '@angular/core';
import { AddPeopleInputComponent } from '../../../../shared/add-people-input/add-people-input.component';
import { UserProfile } from '../../../../interfaces/userProfile';

@Component({
  selector: 'app-channel-add-members-dialog',
  imports: [
    AddPeopleInputComponent
  ],
  templateUrl: './channel-add-members-dialog.component.html',
  styleUrl: './channel-add-members-dialog.component.scss'
})
export class ChannelAddMembersDialogComponent {
  selectedUserList: UserProfile[] = [];

  @ViewChild('addPeopleInput') addPeopleInput?: any;

  selectUserList(event: any) {
    this.selectedUserList = event;
  }
}
