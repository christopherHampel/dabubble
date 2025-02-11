import { Component, ElementRef, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsersDbService } from '../../services/usersDb/users-db.service';
import { UserProfile } from '../../interfaces/userProfile';
import { UserViewSmallComponent } from '../user-view-small/user-view-small.component';

@Component({
  selector: 'app-add-people-input',
  imports: [
    CommonModule,
    FormsModule,
    UserViewSmallComponent
  ],
  templateUrl: './add-people-input.component.html',
  styleUrl: './add-people-input.component.scss'
})
export class AddPeopleInputComponent {
  private usersDb = inject(UsersDbService);
  userName: string = '';
  selectedUser: UserProfile = {} as UserProfile;
  @Output() selectedUserOut = new EventEmitter<UserProfile>();
  @ViewChild('inputField') inputFieldRef!: ElementRef<HTMLInputElement>;

  focusInput() {
    setTimeout(() => this.inputFieldRef.nativeElement.focus(), 50);
    this.resetUserName();
    this.resetSelectedUser();
  }

  getUserList() {
    if (this.usersDb.currentUser) {
      return this.usersDb.userList.filter(user =>
        user.id != this.usersDb.currentUser!.id &&
        !this.usersDb.currentUser!.directmessagesWith.includes(user.id));
    } else {
      return [];
    }
  }

  removeUser() {
    this.selectedUser = {} as UserProfile;
    this.focusInput();
  }

  selectUser(id: string | undefined) {
    const user: any = this.getUserList().find(user => user.id == id);
    this.selectedUser = {
      id: user.id,
      userName: user.userName,
      email: user.emai,
      avatar: user.avatar,
      active: user.active,
      clicked: false,
      directmessagesWith: user.directmessagesWith
    }

    this.resetUserName();
    this.emitSelectedUser();
  }

  emitSelectedUser() {
    this.selectedUserOut.emit(this.selectedUser);
  }

  filteredUsersAfterInput() {
    if (!this.userName) {
      return [];
    } else {
      return this.getUserList().filter(user => user.userName.toLocaleLowerCase().startsWith(this.userName.toLocaleLowerCase()));
    }
  }

  filteredUserForDropdown(currentUser: string): boolean {
    if (!this.userName) {
      return false;
    } else {
      return currentUser.toLocaleLowerCase().startsWith(this.userName.toLocaleLowerCase());
    }
  }

  resetUserName() {
    this.userName = '';
  }

  resetSelectedUser() {
    this.selectedUser = {} as UserProfile;
    this.emitSelectedUser();
  }
}
