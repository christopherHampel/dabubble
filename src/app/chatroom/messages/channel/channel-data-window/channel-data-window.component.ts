import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChannelsDbService } from '../../../../services/message/channels-db.service';
import { ActivatedRoute } from '@angular/router';

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
  channelDb = inject(ChannelsDbService);
  editNameButton: string = 'Bearbeiten';
  editDescriptionButton: string = 'Bearbeiten';
  channelNameEdit: boolean = false;
  channelDescriptionEdit: boolean = false;
  channelName: string = '';
  channelDescription: string = '';

  @Input() dialogOpen: boolean = false;
  @Output() dialogClose = new EventEmitter<boolean>();

  constructor(private activatedRoute: ActivatedRoute) { }


  ngOnInit() {
    this.activatedRoute.params.subscribe(params => {
      this.channelDb.subToChannel(params['id']);
    });

    if (this.channelDb.channel) {
      this.channelName = this.channelDb.channel.name;
      this.channelDescription = this.channelDb.channel.description;
    }
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
      this.channelDb.channel ? this.updateValue(this.channelDb.channel.name) : '';
    }
  }


  editChannelDescription() {
    if (this.channelDescriptionEdit) {
      this.channelDescriptionEdit = false;
      this.editDescriptionButton = 'Bearbeiten';
    } else {
      this.channelDescriptionEdit = true;
      this.editDescriptionButton = 'Speichern';
      this.channelDb.channel ? this.channelDescription = this.channelDb.channel.description : '';
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
    this.channelDb.updateChannel({
      name: this.channelName.substring(2),
      description: this.channelDescription
    })

    await this.channelDb.changeChannel();
  }
}
