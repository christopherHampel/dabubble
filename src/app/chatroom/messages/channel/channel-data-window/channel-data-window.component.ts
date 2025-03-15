import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChannelsDbService } from '../../../../services/message/channels-db.service';

@Component({
  selector: 'app-channel-data-window',
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './channel-data-window.component.html',
  styleUrl: './channel-data-window.component.scss'
})
export class ChannelDataWindowComponent {
  channelsDb = inject(ChannelsDbService);
  editNameButton: string = 'Bearbeiten';
  editDescriptionButton: string = 'Bearbeiten';
  channelNameEdit: boolean = false;
  channelDescriptionEdit: boolean = false;
  channelName: string = '';
  channelDescription: string = '';
  createdUser: any;

  @Input() dialogOpen: boolean = false;
  @Output() dialogClose = new EventEmitter<boolean>();


  ngOnInit() {
    if (this.channelsDb.channel) {
      this.channelName = this.channelsDb.channel.name;
      this.channelDescription = this.channelsDb.channel.description;
    }
  }


  getUserCreated(id: string) {
    return this.channelsDb.channel?.participants.find(user => user.id === id)?.createdBy;
  }


  closeDialog() {
    this.dialogOpen = false;
    this.dialogClose.emit(true);
    this.resetOnClose();
  }


  resetOnClose() {
    this.channelNameEdit = false;
    this.editNameButton = 'Bearbeiten';
    this.channelDescriptionEdit = false;
    this.editDescriptionButton = 'Bearbeiten';
  }


  editChannelName() {
    if (this.channelNameEdit) {
      this.channelNameEdit = false;
      this.editNameButton = 'Bearbeiten';
    } else {
      this.channelNameEdit = true;
      this.editNameButton = 'Speichern';
      this.channelsDb.channel ? this.updateValue(this.channelsDb.channel.name) : '';
    }
  }


  editChannelDescription() {
    if (this.channelDescriptionEdit) {
      this.channelDescriptionEdit = false;
      this.editDescriptionButton = 'Bearbeiten';
    } else {
      this.channelDescriptionEdit = true;
      this.editDescriptionButton = 'Speichern';
      this.channelsDb.channel ? this.channelDescription = this.channelsDb.channel.description : '';
    }
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


  async saveChannel() {
    this.channelsDb.updateChannel({
      name: this.channelName.substring(4),
      description: this.channelDescription
    })

    await this.channelsDb.changeChannel();
  }
}
