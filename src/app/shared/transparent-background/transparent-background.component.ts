import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transparent-background',
  imports: [CommonModule],
  templateUrl: './transparent-background.component.html',
  styleUrl: './transparent-background.component.scss'
})
export class TransparentBackgroundComponent {
  @Input() backgroundOpen: boolean = false;
  @Output() backgroundClose = new EventEmitter<boolean>();

  closeBackground() {
    this.backgroundClose.emit(true);
  }
}
