import { Component, ElementRef, inject, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleMessageComponent } from '../messages/single-message/single-message.component';
import { TextareaComponent } from '../../shared/textarea/textarea.component';
import { ThreadsDbService } from '../../services/message/threads-db.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ScrollService } from '../../services/message/scroll.service';

@Component({
  selector: 'app-threads',
  imports: [CommonModule, TextareaComponent, SingleMessageComponent],
  templateUrl: './threads.component.html',
  styleUrl: './threads.component.scss',
  providers: [ScrollService] // Eigene Instanz des Services
})
export class ThreadsComponent {
  threadsDb = inject(ThreadsDbService);

    @ViewChild('myScrollContainer') private myScrollContainer!: ElementRef;
    @ViewChildren(SingleMessageComponent) messageComponents!: QueryList<SingleMessageComponent>;

  constructor(
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    private scrollService: ScrollService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.threadsDb.currentThreadId.set(params['threadId']);
      this.threadsDb.subMessageList(this.threadsDb.currentThreadId());
    });
  }

  ngAfterViewInit() {
    this.scrollService.setScrollContainer(this.myScrollContainer);
  }

  closeThread() {
    this.threadsDb.currentThreadId.set('');
    this.router.navigate(['/chatroom', {outlets: {thread: null}}]);
  }

  scrollDown(){
    this.scrollService.scrollToBottom();
  }

  ngAfterViewChecked() {
    if (!this.scrollService.hasScrolled && this.messageComponents.length > 0) {
      this.scrollService.scrollToBottom()
    }
  }
}
