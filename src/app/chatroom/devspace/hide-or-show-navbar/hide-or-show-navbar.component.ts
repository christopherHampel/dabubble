import { Component, EventEmitter, Output, signal } from '@angular/core';
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
  // isClosed: boolean = false;
  isClosed = signal<boolean>(false);

  // @Output() navbarClose = new EventEmitter<boolean>();

  constructor(private threadsDb: ThreadsDbService, private resizeService: ResizeService) {}

  get devSpaceClose() {
    return this.resizeService.devSpaceClose()
  }

  closeDevspace() {
      if(!this.isClosed()) {
        this.resizeService.setDevSpaceClose(true);
        this.setIsClosed(true);
        // this.isClosed = true;
      } else {
        this.resizeService.setDevSpaceClose(false);
        this.setIsClosed(false);
      }
      this.threadsDb.closeThread();
  }

  setIsClosed(value:boolean) {
    this.isClosed.set(value);
  }
}
