import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThreadsDbService } from '../../../services/message/threads-db.service';
import { ResizeService } from '../../../services/responsive/resize.service';

@Component({
  selector: 'app-hide-or-show-navbar',
  imports: [CommonModule],
  templateUrl: './hide-or-show-navbar.component.html',
  styleUrl: './hide-or-show-navbar.component.scss'
})
export class HideOrShowNavbarComponent {
  isClosed: boolean = false;
  // @Output() navbarClose = new EventEmitter<boolean>();

  constructor(private threadsDb: ThreadsDbService, private resizeService: ResizeService) {}

  get devSpaceClose() {
    return this.resizeService.devSpaceClose()
  }

  closeDevspace() {
      this.isClosed = !this.isClosed;
      // this.navbarClose.emit(this.isClosed);
      this.resizeService.setDevSpaceClose(this.isClosed);
  }
}
