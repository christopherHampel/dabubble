import { Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddPeopleInputComponent } from '../../../../shared/add-people-input/add-people-input.component';
import { UserProfile } from '../../../../interfaces/userProfile';

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
  selectedUserList: UserProfile[] = [];
  afterViewCheckedFlag: boolean = true;

  @Input() dialogOpen: boolean = false;
  @Output() dialogClose = new EventEmitter<boolean>();
  @ViewChild('addPeopleInput') addPeopleInput!: any;

  ngAfterViewChecked() {
    if (this.dialogOpen && this.addPeopleInput && this.afterViewCheckedFlag) {
      this.afterViewCheckedFlag = false;
      this.addPeopleInput.focusInput();
    }
  }


  selectUserList(event: any) {
    this.selectedUserList = event;
  }


  closeDialog() {
    this.dialogOpen = false;
    this.dialogClose.emit(true);
    this.addPeopleInput.resetSelectedUser();
  }


  resetAfterViewChecked() {
    this.afterViewCheckedFlag = true;
  }

  async updateChannel() {
    await this.addPeopleInput.createChannel();

    this.closeDialog();
  }
}
