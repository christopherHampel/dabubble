import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleMessageComponent } from '../messages/single-message/single-message.component';
import { TextareaComponent } from '../../shared/textarea/textarea.component';
import { ThreadsDbService } from '../../services/message/threads-db.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-threads',
  imports: [CommonModule, TextareaComponent, SingleMessageComponent],
  templateUrl: './threads.component.html',
  styleUrl: './threads.component.scss'
})
export class ThreadsComponent {
  threadsDb = inject(ThreadsDbService)

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.threadsDb.currentThreadId.set(params['threadId']);
      this.threadsDb.subMessageList(this.threadsDb.currentThreadId());
    });
  }

  closeThread() {
    this.threadsDb.currentThreadId.set('');
    this.router.navigate(['/chatroom', {outlets: {thread: null}}]);
  }
}
