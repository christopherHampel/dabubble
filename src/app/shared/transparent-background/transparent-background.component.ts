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
  @Output() backgroundClose = new EventEmitter<boolean>();
  @Output() dialogComponent = new EventEmitter<'createChannel'>();

  closeBackground() {
    this.dialogControlWindow.resetDialogs();
  }
}
