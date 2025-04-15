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
    if (this.dialogControlWindow.isDataWindowOpen && this.dialogControlWindow.isAddMembersOpen) {
      this.addMembersDialogClose.emit(true);
    } else if (this.dialogControlWindow.isCreateChannelOpen && this.dialogControlWindow.isAddPeopleOpen) {
      this.addPeopleDialogClose.emit(true);
    } else if (this.dialogControlWindow.isUserProfilOpen) {
      this.dialogControlWindow.closeDialog('userProfil');
    } else {
      this.dialogControlWindow.resetDialogs();
    }
  }
}
