import { Component } from '@angular/core';
import { AddPeopleInputComponent } from '../../../../shared/add-people-input/add-people-input.component';

@Component({
  selector: 'app-channel-add-members-dialog',
  imports: [
    AddPeopleInputComponent
  ],
  templateUrl: './channel-add-members-dialog.component.html',
  styleUrl: './channel-add-members-dialog.component.scss'
})
export class ChannelAddMembersDialogComponent {

}
