import { Component, EventEmitter, Input, Output } from '@angular/core';
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
  @Input() dialogOpen: boolean = false;
  @Output() dialogClose = new EventEmitter<boolean>();
  @Output() addPeopleDialogOpen = new EventEmitter<boolean>();


  ngOnChanges() {
    console.log(this.channelName);
  }

  closeDialog() {
    this.dialogOpen = false;
    this.dialogClose.emit(true);

    this.reset();
  }


  openAddPeopleDialog() {
    this.addPeopleDialogOpen.emit(true);
  }

  reset() {
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
      console.log('Update');
      this.channelName = '#   ' + value.trimStart();
    } 
  }
}
