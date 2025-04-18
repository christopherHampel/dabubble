import {Component, effect, EventEmitter, inject, Output, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AddPeopleInputComponent} from '../../../../shared/add-people-input/add-people-input.component';
import {UserProfile} from '../../../../interfaces/userProfile';
import {ResizeService} from '../../../../services/responsive/resize.service';
import {DialogWindowControlService} from '../../../../services/dialog-window-control/dialog-window-control.service';
import {ChannelsDbService} from '../../../../services/message/channels-db.service';
import {UsersDbService} from '../../../../services/usersDb/users-db.service';

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
  private usersDb = inject(UsersDbService);

  selectedOption: string = 'option1';
  selectedUser: UserProfile = {} as UserProfile;
  mobileClose: boolean = false;
  dropdownChannelSelelction: boolean = false;
  selectedChannel: string = '';
  flag: boolean = true;

  @Output() dialogComponent = new EventEmitter<'none' | 'createChannel'>();
  @ViewChild('addPeopleInput') addPeopleInput!: any;

  constructor() {
    effect(() => {
      if (!this.flag) return;

      if (this.channelsDb.channelList.length > 0 && this.flag) {
        this.flag = false;
        this.selectedChannel = this.getChannelList()[0].name
      }
    })
  }


  isSelectedChannel(i: number) {
    return this.channelsDb.channelList[i].name !== this.selectedChannel;
  }


  selectChannel(name: string) {
    this.selectedChannel = name;
  }


  getChannelList() {
    return this.channelsDb.channelList;
  }


  openDropdownChannelSelelction(event: Event) {
    event.stopPropagation();
    this.dropdownChannelSelelction = !this.dropdownChannelSelelction;
  }


  closeDropdownChannelSelelction() {
    this.dropdownChannelSelelction = false;
  }


  closeAddPeopleDialogMobile() {
    this.mobileClose = true;

    setTimeout(() => {
      this.resetOption();
      this.closeDropdownChannelSelelction()
      this.mobileClose = false;
      this.dialogWindowControl.closeDialog('addPeople');
      this.flag = true;
    }, 500);
  }


  focusInput() {
    this.addPeopleInput.focusInput();
  }


  selectUser(event: any) {
    this.selectedUser = event;
  }


  closeAddPeopleDialog() {
    this.resetOption();
    this.closeDropdownChannelSelelction()
    this.dialogWindowControl.resetDialogs();
    this.flag = true;
  }


  resetOption() {
    this.selectedOption = 'option1'
  }


  createChannel() {
    if (this.selectedOption === 'option1') {
      this.createChannelOption1()
    } else {
      this.createChannelOption2()
    }
  }


  async  createChannelOption1() {
    let channel = this.channelsDb.channelList.find(channel => channel.name === this.selectedChannel);
    let participants: { id: string; createdBy: boolean; }[] = [];
    let participantsIds: string[] = [];

    channel?.participants.forEach(participant => {
      if (participant.id === this.usersDb.currentUser?.id) {
        participants.unshift({id: participant.id, createdBy: true})
        participantsIds.unshift(participant.id);
      } else {
        participants.push({id: participant.id, createdBy: false})
        participantsIds.push(participant.id);
      }
    })

    this.channelsDb.updateChannel({
      participants: participants,
      participantIds: participantsIds
    });

    await this.channelsDb.addChannel();
    this.closeAddPeopleDialog();
  }


  async createChannelOption2() {
    await this.addPeopleInput.createChannel();
    this.addPeopleInput.resetSelectedUserList();
    this.closeAddPeopleDialog();
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
