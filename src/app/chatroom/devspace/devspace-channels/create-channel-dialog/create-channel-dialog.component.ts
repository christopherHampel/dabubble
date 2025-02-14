import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  channelName: string = '';
  channelDescription: string = '';
  @Output() dialogComponent = new EventEmitter< 'none' | 'addPeople'>();

  ngOnChanges() {
    console.log(this.channelName);
  }


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
