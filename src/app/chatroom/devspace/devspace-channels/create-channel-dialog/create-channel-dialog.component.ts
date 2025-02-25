import { Component, EventEmitter, inject, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChannelsDbService } from '../../../../services/message/channels-db.service';
import { UsersDbService } from '../../../../services/usersDb/users-db.service';

@Component({
  selector: 'app-create-channel-dialog',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './create-channel-dialog.component.html',
  styleUrl: './create-channel-dialog.component.scss'
})
export class CreateChannelDialogComponent {
  private channelsDb = inject(ChannelsDbService);
  private usersDb = inject(UsersDbService);

  channelName: string = '';
  channelDescription: string = '';

  @Output() dialogComponent = new EventEmitter<'none' | 'addPeople'>();

  closeDialog() {
    this.dialogComponent.emit('none');

    this.resetInputs();
  }


  openDialog() {
    this.dialogComponent.emit('addPeople');

    this.resetInputs();
  }


  resetInputs() {
    this.channelName = '';
    this.channelDescription = '';
  }


  createChannel() {
    this.channelsDb.updateChannel({
      id: '',
      createdBy: this.usersDb.currentUser?.userName,
      name: this.channelName.substring(2),
      description: this.channelDescription
    })

    this.resetInputs();
  }


  Backspace?: KeyboardEvent;

  onKeyDown(event: KeyboardEvent) {
    this.Backspace = event;
  }


  updateValue(value: string) {
    if (value === '#   ' && this.Backspace!.key === 'Backspace') {
      this.channelName = '';
    }

    if (!value.startsWith('#   ')) {
      this.channelName = '#   ' + value.trimStart();
    }
  }
}