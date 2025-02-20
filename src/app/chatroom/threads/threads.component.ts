import { Component, ElementRef, inject, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleMessageComponent } from '../messages/single-message/single-message.component';
import { TextareaComponent } from '../../shared/textarea/textarea.component';
import { ThreadsDbService } from '../../services/message/threads-db.service';
import { ActivatedRoute } from '@angular/router';
import { ScrollService } from '../../services/message/scroll.service';
import { Thread } from '../../interfaces/thread';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-threads',
  imports: [CommonModule, TextareaComponent, SingleMessageComponent],
  templateUrl: './threads.component.html',
  styleUrl: './threads.component.scss',
  providers: [ScrollService]
})
export class ThreadsComponent {
  threadsDb = inject(ThreadsDbService);

  @ViewChild('myScrollContainer') private myScrollContainer!: ElementRef;
  @ViewChildren(SingleMessageComponent) messageComponents!: QueryList<SingleMessageComponent>;

  threadData: Thread = {
    docId: '',
    participiants: [],
    participiantsDetails: {},
    // threadName: ''
  };
  hasScrolled:boolean = false;
  // private logoutSubscription!: Subscription;
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private scrollService: ScrollService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      this.threadsDb.currentThreadId.set(params['threadId']);
      this.threadsDb.subMessageList(this.threadsDb.currentThreadId());
      this.threadsDb.subscribeToThread(this.threadsDb.currentThreadId());
    });
  }

  // subcribeLogOut() {
  //   this.logoutSubscription = this.authService.logout$.subscribe(() => {
  //     this.scrollService.hasScrolled = false;
  //   });
  // }

  ngAfterViewInit() {
    if (this.myScrollContainer) {
      this.scrollService.setScrollContainer(this.myScrollContainer);      
    } else {
      console.warn('myScrollContainer is not available in ngAfterViewInit');
    }
  }

  closeThread() {
    this.threadsDb.closeThread()
  }

  scrollDown() {
    this.scrollService.scrollToBottom();
  }

  ngAfterViewChecked() {
    if (!this.scrollService.hasScrolled && this.messageComponents.length > 0) {
      this.scrollService.scrollToBottom();
      setTimeout(() => {
        this.scrollService.hasScrolled = true;
      }, 300)
    }
  }
}
