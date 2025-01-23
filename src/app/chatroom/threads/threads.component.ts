import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleMessageComponent } from '../messages/single-message/single-message.component';
import { TextareaComponent } from '../../shared/textarea/textarea.component';
import { ThreadsDbService } from '../../services/message/threads-db.service';

@Component({
  selector: 'app-threads',
  imports: [CommonModule, TextareaComponent, SingleMessageComponent],
  templateUrl: './threads.component.html',
  styleUrl: './threads.component.scss'
})
export class ThreadsComponent {
  threadsDb = inject(ThreadsDbService);

  closeThread() {
    this.threadsDb.currentThreadId.set('');
  }
}
