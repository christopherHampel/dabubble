import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DialogWindowControlService {
  dialogsSig = signal<{ component: string; open: boolean }[]>([
    {component: 'addFriend', open: false},
    {component: 'createChannel', open: false},
    {component: 'addPeople', open: false},
    {component: 'dataWindow', open: false},
    {component: 'membersInfo', open: false},
    {component: 'addMembers', open: false},
    {component: 'userProfil', open: false},
    {component: 'dropdown', open: false}
  ]);

  constructor() {
  }


  get isAddFriendOpen() {
    return this.dialogsSig().some((dialog) => dialog.component === 'addFriend' && dialog.open);
  }


  get isCreateChannelOpen() {
    return this.dialogsSig().some((dialog) => dialog.component === 'createChannel' && dialog.open);
  }


  get isAddPeopleOpen() {
    return this.dialogsSig().some((dialog) => dialog.component === 'addPeople' && dialog.open);
  }


  get isDataWindowOpen() {
    return this.dialogsSig().some((dialog) => dialog.component === 'dataWindow' && dialog.open);
  }


  get isMembersInfoOpen() {
    return this.dialogsSig().some((dialog) => dialog.component === 'membersInfo' && dialog.open);
  }


  get isAddMembersOpen() {
    return this.dialogsSig().some((dialog) => dialog.component === 'addMembers' && dialog.open);
  }


  get isUserProfilOpen() {
    return this.dialogsSig().some((dialog) => dialog.component === 'userProfil' && dialog.open);
  }


  get isDropdownOpen() {
    return this.dialogsSig().some((dialog) => dialog.component === 'dropdown' && dialog.open);
  }


  openDialog(componentName: string) {
    this.dialogsSig.set(this.dialogsSig().map(dialog =>
      dialog.component === componentName ? {...dialog, open: true} : dialog
    ));
  }


  closeDialog(componentName: string) {
    this.dialogsSig.set(this.dialogsSig().map(dialog =>
      dialog.component === componentName ? {...dialog, open: false} : dialog
    ));
  }


  resetDialogs() {
    this.dialogsSig.set(
      this.dialogsSig().map(dialog => ({...dialog, open: false}))
    );
  }
}
