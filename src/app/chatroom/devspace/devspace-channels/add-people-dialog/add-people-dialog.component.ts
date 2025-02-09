import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddPeopleInputComponent } from '../../../../shared/add-people-input/add-people-input.component';
import { UserProfile } from '../../../../interfaces/userProfile';

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
  userName: string = '';
  selectedUser: UserProfile = {} as UserProfile;
  @Input() dialogOpen: boolean = true;
  @ViewChild('addPeopleInput') addPeopleInput!: any;

  focusInput() {
    this.addPeopleInput.focusInput();
  }

  selectUser(event: any) {
    this.selectedUser = event;
  }

  resetUserName() {
    this.userName = '';
  }

  buttonDisabled(): boolean {
    if (this.selectedOption === 'option1') {
      return false;
    } else if (this.selectedOption === 'option2' && this.selectedUser.id) {
      console.log(this.selectedUser);
      return false;
    }
    return true;
  }
}
