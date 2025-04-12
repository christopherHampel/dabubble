import {Component, effect, inject, signal, ViewChild} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CreateChannelDialogComponent} from './create-channel-dialog/create-channel-dialog.component';
import {AddPeopleDialogComponent} from './add-people-dialog/add-people-dialog.component';
import {TransparentBackgroundComponent} from '../../../shared/transparent-background/transparent-background.component';
import {ChannelsDbService} from '../../../services/message/channels-db.service';
import {Router} from '@angular/router';
import {UsersDbService} from '../../../services/usersDb/users-db.service';
import {ResizeService} from '../../../services/responsive/resize.service';
import { DialogWindowControlService } from '../../../services/dialog-window-control/dialog-window-control.service';

@Component({
  selector: 'app-devspace-channels',
  imports: [
    CommonModule,
    CreateChannelDialogComponent,
    AddPeopleDialogComponent,
    TransparentBackgroundComponent
  ],
  templateUrl: './devspace-channels.component.html',
  styleUrl: './devspace-channels.component.scss'
})
export class DevspaceChannelsComponent {
  private channelsDb = inject(ChannelsDbService);
  usersDb = inject(UsersDbService);
  dialogWindowControl = inject(DialogWindowControlService);

  channelsOpen: boolean = true;
  dialog: boolean = false;
  selectedChannelIdSig = signal<string>('');
  dialogComponent: 'none' | 'createChannel' | 'addPeople' | 'mobile' = 'none';
  mediaW600px: MediaQueryList = window.matchMedia("(max-width: 600px)");

  @ViewChild('channelDialog') channelDialog!: any;
  @ViewChild('peopleDialog') peopleDialog!: any;

  constructor(private router: Router, private resize: ResizeService) {
    effect(() => {
      if (this.usersDb.currentUser?.channelFriendHighlighted) {
        this.selectedChannelIdSig.set(this.usersDb.currentUser.channelFriendHighlighted);
      }
    })
  }


  selectChannel(id: string) {
    this.resize.checkSiteWidth(960);
    this.usersDb.updateChanelFriendHighlighted(id);
    this.selectedChannelIdSig.set(id);
  }


  getChannelList() {
    return this.channelsDb.channelList;
  }


  openChannels() {
    this.channelsOpen = !this.channelsOpen;
  }


  openDialog() {
    //this.dialogComponent = 'createChannel';
    //this.dialog = true;
    this.dialogWindowControl.openDialog('createChannel')
    this.channelDialog.focusInput();
  }


  closeDialog(event: any) {
    this.dialogComponent = event;
    if (this.dialogComponent === 'addPeople') {
      this.dialog = true;
    } else this.dialog = this.dialogComponent === 'mobile';
    !this.mediaW600px.matches ? this.channelDialog.resetInputs() : null;
    this.peopleDialog.resetOption();
  }


  openChannel(id: string) {
    this.router.navigate(['/chatroom', {outlets: {chats: ['channel', id], thread: null}}]);
  }
}
