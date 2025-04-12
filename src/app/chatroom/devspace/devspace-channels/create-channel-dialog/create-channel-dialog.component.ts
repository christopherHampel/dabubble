import {Component, ElementRef, EventEmitter, inject, Output, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChannelsDbService } from '../../../../services/message/channels-db.service';
import { ResizeService } from '../../../../services/responsive/resize.service';
import { DialogWindowControlService } from '../../../../services/dialog-window-control/dialog-window-control.service';

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
  resize = inject(ResizeService);
  dialogWindowControl = inject(DialogWindowControlService);

  channelName: string = '';
  channelDescription: string = '';

  @Output() dialogComponent = new EventEmitter<'none' | 'addPeople' | 'mobile'>();
  @ViewChild('inputField') inputFieldRef!: ElementRef<HTMLInputElement>;

  focusInput() {
    setTimeout(() => this.inputFieldRef.nativeElement.focus(), 50);
  }


  closeDialog() {
    this.dialogWindowControl.resetDialogs();
    !this.resize.checkMediaW600px ? this.resetInputs() : null;
  }


  openDialog() {
    this.dialogWindowControl.closeDialog('createChannel');
    this.dialogWindowControl.openDialog('addPeople');

    !this.resize.checkMediaW600px ? this.resetInputs() : null;
  }


  resetInputs() {
    this.channelName = '';
    this.channelDescription = '';
  }


  createChannel() {
    this.channelsDb.updateChannel({
      id: '',
      name: this.channelName.substring(4),
      description: this.channelDescription
    })

    !this.resize.checkMediaW600px ? this.resetInputs() : null;
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
