import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-transparent-background',
  imports: [CommonModule],
  templateUrl: './transparent-background.component.html',
  styleUrl: './transparent-background.component.scss'
})
export class TransparentBackgroundComponent {
  mediaW600px: MediaQueryList = window.matchMedia('(max-width: 600px)');

  @Input() backgroundOpen: boolean = false;
  @Output() backgroundClose = new EventEmitter<boolean>();
  @Output()dialogComponent = new EventEmitter<'createChannel'>();

  closeBackground() {
    if (!this.mediaW600px.matches) {
      this.backgroundClose.emit(true);
    } else {
      this.dialogComponent.emit('createChannel');
    }
  }
}
