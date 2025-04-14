import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ResizeService} from '../../services/responsive/resize.service';
import {DialogWindowControlService} from '../../services/dialog-window-control/dialog-window-control.service';

@Component({
  selector: 'app-transparent-background',
  imports: [CommonModule],
  templateUrl: './transparent-background.component.html',
  styleUrl: './transparent-background.component.scss'
})
export class TransparentBackgroundComponent {
  resize = inject(ResizeService);
  dialogControlWindow = inject(DialogWindowControlService);

  @Input() backgroundOpen: boolean = false;
  @Output() addMembersDialogClose = new EventEmitter<boolean>();
  @Output() addPeopleDialogClose = new EventEmitter<boolean>();

  closeBackground() {
<<<<<<< HEAD
    debugger;
    if (!this.resize.checkMediaW600px()) {
      this.backgroundClose.emit(true);
=======
    if (this.dialogControlWindow.isDataWindowOpen && this.dialogControlWindow.isAddMembersOpen) {
      this.addMembersDialogClose.emit(true);
    } else if (this.dialogControlWindow.isCreateChannelOpen && this.dialogControlWindow.isAddPeopleOpen) {
      this.addPeopleDialogClose.emit(true);
>>>>>>> a45e3ae5476572487e0ab9a5f08a7e7ec2760568
    } else {
      this.dialogControlWindow.resetDialogs();
    }
  }
}
