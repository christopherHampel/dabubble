import {Component, EventEmitter, Output, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {AddPeopleInputComponent} from '../../../../shared/add-people-input/add-people-input.component';
import {UserProfile} from '../../../../interfaces/userProfile';

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
  selectedOption: string = 'option1';
  selectedUser: UserProfile = {} as UserProfile;
  mediaW600px: MediaQueryList = window.matchMedia("(max-width: 600px)");
  mobileClose: boolean = false;

  @Output() dialogComponent = new EventEmitter<'none' | 'createChannel'>();
  @ViewChild('addPeopleInput') addPeopleInput!: any;

  closeMobile() {
    this.mobileClose = true;
    setTimeout(() => {
      this.mobileClose = false
      this.dialogComponent.emit('createChannel')
    }, 500);
  }

  focusInput() {
    this.addPeopleInput.focusInput();
  }

  selectUser(event: any) {
    this.selectedUser = event;
  }

  closeDialog() {
    this.dialogComponent.emit('none');
    this.resetOption();
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
