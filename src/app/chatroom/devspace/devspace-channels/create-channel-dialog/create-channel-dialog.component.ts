import {Component, ElementRef, EventEmitter, inject, Output, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChannelsDbService } from '../../../../services/message/channels-db.service';
import { ResizeService } from '../../../../services/responsive/resize.service';

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

  channelName: string = '';
  channelDescription: string = '';

  @Output() dialogComponent = new EventEmitter<'none' | 'addPeople' | 'mobile'>();
  @ViewChild('inputField') inputFieldRef!: ElementRef<HTMLInputElement>;

  focusInput() {
    setTimeout(() => this.inputFieldRef.nativeElement.focus(), 50);
  }


  closeDialog() {
    this.dialogComponent.emit('none');

    !this.resize.checkMediaW600px ? this.resetInputs() : null;
  }


  openDialog() {
    if (!this.resize.checkMediaW600px) {
      this.dialogComponent.emit('addPeople');
    } else {
      this.dialogComponent.emit('mobile');
    }

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
