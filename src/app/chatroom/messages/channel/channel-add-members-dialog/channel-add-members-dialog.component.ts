import {Component, EventEmitter, inject, Input, Output, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AddPeopleInputComponent} from '../../../../shared/add-people-input/add-people-input.component';
import {UserProfile} from '../../../../interfaces/userProfile';
import {DialogWindowControlService} from '../../../../services/dialog-window-control/dialog-window-control.service';

@Component({
  selector: 'app-channel-add-members-dialog',
  imports: [
    CommonModule,
    AddPeopleInputComponent
  ],
  templateUrl: './channel-add-members-dialog.component.html',
  styleUrl: './channel-add-members-dialog.component.scss'
})
export class ChannelAddMembersDialogComponent {
  dialogWindowControl = inject(DialogWindowControlService);

  selectedUserList: UserProfile[] = [];
  mobileClose: boolean = false;

  @ViewChild('addPeopleInput') addPeopleInput!: any;

  focusInput() {
    this.addPeopleInput.focusInput();
  }


  selectUserList(event: any) {
    this.selectedUserList = event;
  }


  closeAddMembersDialog() {
    this.mobileClose = true;

    setTimeout(() => {
      this.mobileClose = false;
      this.dialogWindowControl.closeDialog('addMembers');
    }, 500)
  }


  async updateChannel() {
    await this.addPeopleInput.createChannel();

    this.closeAddMembersDialog();
  }


  isMobile() {
    return this.dialogWindowControl.isDataWindowOpen && this.dialogWindowControl.isAddMembersOpen;
  }
}
