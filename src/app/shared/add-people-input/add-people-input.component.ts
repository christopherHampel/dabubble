import { Component, ElementRef, EventEmitter, inject, Input, Output, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UsersDbService } from '../../services/usersDb/users-db.service';
import { UserProfile } from '../../interfaces/userProfile';
import { UserViewSmallComponent } from '../user-view-small/user-view-small.component';
import { ChannelsDbService } from '../../services/message/channels-db.service';

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
  private channelsDb = inject(ChannelsDbService);

  userName: string = '';
  selectedUser: UserProfile = {} as UserProfile;
  selectedUserList: UserProfile[] = [];

  @Input() component: 'addFriend' | 'addPeople' = 'addFriend';
  @Output() selectedUserOut = new EventEmitter<UserProfile>();
  @ViewChild('inputField') inputFieldRef!: ElementRef<HTMLInputElement>;


  focusInput() {
    setTimeout(() => this.inputFieldRef.nativeElement.focus(), 50);
    if (this.component === 'addPeople') {
      this.selectedUserList.length === 0 ? this.selectUser(this.usersDb.currentUser!.id) : null;
      this.resetUserName();
      this.resetSelectedUser();
    }
  }


  getUserList() {
    if (this.usersDb.currentUser) {
      if (this.component === 'addFriend') {
        return this.getUserFriend();
      } else {
        return this.getUserChannel();
      }
    } else {
      return [];
    }
  }


  getUserFriend() {
    return this.usersDb.userList.filter(user =>
      user.id != this.usersDb.currentUser!.id &&
      !this.usersDb.currentUser!.directmessagesWith.includes(user.id));
  }


  getUserChannel() {
    return this.usersDb.userList.filter(user =>
      user.id != this.usersDb.currentUser!.id &&
      !this.selectedUserList.find(selectedUser => selectedUser.id == user.id));
  }


  emitSelectedUser() {
    this.selectedUserOut.emit(this.selectedUser);
  }


  removeUser(index: number) {
    this.selectedUserList.splice(index, 1);
    this.focusInput();
  }


  selectUser(id: string | undefined) {
    let user: any = {};
    if (this.selectedUserList.length > 0) {
      user = this.getUserList().find(user => user.id == id);
    } else {
      user = this.usersDb.userList.find(user => user.id == id);
    }

    this.addSelectedUser(user);
    this.emitSelectedUser();
    this.selectedUserToList();
    this.resetUserName();

    console.log(this.selectedUserList);
  }


  addSelectedUser(user: any) {
    this.selectedUser = {
      id: user.id,
      userName: user.userName,
      email: user.email,
      avatar: user.avatar,
      active: user.active,
      clicked: false,
      directmessagesWith: user.directmessagesWith
    }
  }


  selectedUserToList() {
    const userExist = this.selectedUserList.find(user => user.id === this.selectedUser.id);
    if (!userExist) {
      this.selectedUserList.push(this.selectedUser);
    }
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
  }

  resetSelectedUserList() {
    this.selectedUserList = [];
  }


  async createChannel() {
    let participants: { id: string; createdBy: boolean; }[];
    participants = this.selectedUserList.map((user, index) => ({
      id: user.id,
      createdBy: index > 0 ? false : true,
    })) || [];

    this.channelsDb.updateChannel({
      participants: participants
    })

    await this.channelsDb.addChannel();
  }


  /**
   * Scroll added user with dragging the mouse
   */
  @ViewChild('scrollContent', { static: false }) scrollContent!: ElementRef;

  items = Array.from({ length: 5 }, (_, i) => i + 1);
  isDragging = false;
  startX = 0;
  scrollLeft = 0;
  lastItemCount = this.items.length;
  animationFrameId: number | null = null;

  ngAfterViewChecked(): void {
    if (this.items.length !== this.lastItemCount && this.component === 'addPeople') {
      this.scrollToEnd();
      this.lastItemCount = this.items.length;
    }
  }


  addItem(): void {
    this.items.push(this.items.length + 1);
  }


  scrollToEnd(): void {
    setTimeout(() => {
      const scrollElement = this.scrollContent.nativeElement;
      scrollElement.style.scrollBehavior = 'smooth';
      scrollElement.scrollLeft = scrollElement.scrollWidth;
      setTimeout(() => scrollElement.style.scrollBehavior = 'auto', 500);
    }, 50);
  }


  startDragging(event: MouseEvent): void {
    this.isDragging = true;
    this.startX = event.pageX - this.scrollContent.nativeElement.offsetLeft;
    this.scrollLeft = this.scrollContent.nativeElement.scrollLeft;

    document.body.style.userSelect = 'none';
    this.scrollContent.nativeElement.style.cursor = 'grabbing';
  }


  stopDragging(): void {
    this.isDragging = false;
    document.body.style.userSelect = 'auto';
    this.scrollContent.nativeElement.style.cursor = 'grab';

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }


  onDragging(event: MouseEvent): void {
    if (!this.isDragging) return;
    event.preventDefault();

    if (this.animationFrameId) cancelAnimationFrame(this.animationFrameId);

    this.animationFrameId = requestAnimationFrame(() => {
      const x = event.pageX - this.scrollContent.nativeElement.offsetLeft;
      const walk = (x - this.startX) * 1.5;
      this.scrollContent.nativeElement.scrollLeft = this.scrollLeft - walk;
    });
  }
}