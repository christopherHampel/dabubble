import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import { ResizeService } from '../../services/responsive/resize.service';

@Component({
  selector: 'app-transparent-background',
  imports: [CommonModule],
  templateUrl: './transparent-background.component.html',
  styleUrl: './transparent-background.component.scss'
})
export class TransparentBackgroundComponent {
  resize = inject(ResizeService);

  @Input() backgroundOpen: boolean = false;
  @Output() backgroundClose = new EventEmitter<boolean>();
  @Output()dialogComponent = new EventEmitter<'createChannel'>();

  ngOnChanges() {
    console.log('Background: ', this.backgroundOpen);
  }

  closeBackground() {
    debugger;
    if (!this.resize.checkMediaW600px()) {
      this.backgroundClose.emit(true);
    } else {
      this.dialogComponent.emit('createChannel');
    }
  }
}
