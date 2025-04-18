import {Component, EventEmitter, inject, Output, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AddPeopleInputComponent} from '../../../../shared/add-people-input/add-people-input.component';
import {UserProfile} from '../../../../interfaces/userProfile';
import {ResizeService} from '../../../../services/responsive/resize.service';
import {DialogWindowControlService} from '../../../../services/dialog-window-control/dialog-window-control.service';
import { ChannelsDbService } from '../../../../services/message/channels-db.service';

@Component({
  selector: 'app-add-people-dialog',
  imports: [
    CommonModule,
    FormsModule,
    AddPeopleInputComponent
  ],
  templateUrl: './add-people-dialog.component.html',
  styleUrl: './add-people-dialog.component.scss'
})
export class AddPeopleDialogComponent {
  resize = inject(ResizeService)
  dialogWindowControl = inject(DialogWindowControlService);
  channelsDb = inject(ChannelsDbService);

  selectedOption: string = 'option1';
  selectedUser: UserProfile = {} as UserProfile;
  mobileClose: boolean = false;
  dropdownChannelSelelction: boolean = false;

  @Output() dialogComponent = new EventEmitter<'none' | 'createChannel'>();
  @ViewChild('addPeopleInput') addPeopleInput!: any;


  getChannelList() {
    return this.channelsDb.channelList;
  }

  openpdownChannelSelelction() {
    this.dropdownChannelSelelction = !this.dropdownChannelSelelction;
  }

  closeAddPeopleDialog() {
    this.mobileClose = true;

    setTimeout(() => {
      this.resetOption();
      this.mobileClose = false;
      this.dialogWindowControl.closeDialog('addPeople');
    }, 500);
  }


  focusInput() {
    this.addPeopleInput.focusInput();
  }


  selectUser(event: any) {
    this.selectedUser = event;
  }


  closeDialog() {
    this.resetOption();
    this.dialogWindowControl.resetDialogs();
  }


  resetOption() {
    this.selectedOption = 'option1'
  }


  async createChannel() {
    await this.addPeopleInput.createChannel();
    this.addPeopleInput.resetSelectedUserList();
    this.closeDialog();
  }


  buttonDisabled(): boolean {
    if (this.selectedOption === 'option1') {
      return false;
    } else if (this.selectedOption === 'option2' && this.addPeopleInput.selectedUserList.length > 0) {
      return false;
    }
    return true;
  }
}
