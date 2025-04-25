import { Component, EventEmitter, Output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThreadsDbService } from '../../../services/message/threads-db.service';
import { ResizeService } from '../../../services/responsive/resize.service';
import { ChatsService } from '../../../services/message/chats.service';

@Component({
  selector: 'app-hide-or-show-navbar',
  imports: [CommonModule],
  templateUrl: './hide-or-show-navbar.component.html',
  styleUrl: './hide-or-show-navbar.component.scss'
})
export class HideOrShowNavbarComponent {
  isClosed = signal<boolean>(false);

  constructor(private threadsDb: ThreadsDbService, private resizeService: ResizeService, private chatService: ChatsService) {}

  get devSpaceClose() {
    return this.resizeService.devSpaceClose()
  }

  getZIndexForNavBar() {
    return this.chatService.indexForNavBarButton();
  }

  closeDevspace() {
      if(!this.isClosed()) {
        this.resizeService.setDevSpaceClose(true);
        this.setIsClosed(true);
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
