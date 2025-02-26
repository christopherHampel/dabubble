import {
  Component,
  effect,
  ElementRef,
  inject,
  QueryList,
  signal,
  SimpleChanges,
  ViewChild,
  ViewChildren,
  WritableSignal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { SingleMessageComponent } from '../messages/single-message/single-message.component';
import { TextareaComponent } from '../../shared/textarea/textarea.component';
import { ThreadsDbService } from '../../services/message/threads-db.service';
import { ActivatedRoute } from '@angular/router';
import { ScrollService } from '../../services/message/scroll.service';
import { Thread } from '../../interfaces/thread';
import { Observable, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';
import { MessagesFieldComponent } from '../../shared/messages-field/messages-field.component';
import { ChatsService } from '../../services/message/chats.service';

@Component({
  selector: 'app-threads',
  imports: [
    CommonModule,
    TextareaComponent,
    SingleMessageComponent,
    MessagesFieldComponent,
  ],
  templateUrl: './threads.component.html',
  styleUrl: './threads.component.scss',
  providers: [ScrollService],
})
export class ThreadsComponent {
  threadsDb = inject(ThreadsDbService);

  @ViewChild('myScrollContainerThread')
  private myScrollContainerThread!: ElementRef;
  @ViewChildren(SingleMessageComponent)
  messageComponents!: QueryList<SingleMessageComponent>;

  threadData: Thread = {
    docId: '',
    participiants: [],
    participiantsDetails: {},
    // threadName: ''
  };
  hasScrolled: boolean = false;
  private paramMapSubscription!: Subscription;
  chatId: string = '';
  chatMessages$!: Observable<any[]>;
  lastMessageDocId: WritableSignal<string | null> = signal<string | null>(null);

  constructor(
    private activatedRoute: ActivatedRoute,
    private scrollService: ScrollService,
    private authService: AuthService,
    private route: ActivatedRoute,
    private chatService: ChatsService
  ) {
    effect(() => {
      const currentDocId = this.lastMessageDocId();
      console.log(this.lastMessageDocId());

      if (currentDocId) {
        this.scrollService.scrollToBottom();
      } 
      if(this.threadsDb.currentThreadId()) {
        this.scrollService.scrollToBottom();
      }
    });
  }

  ngOnInit(): void {
    this.subscribeThreadData();
    this.chatService.watchLastMessageDocId(
      this.threadsDb.currentThreadId(),
      'threads',
      this.lastMessageDocId
    );
  }

  subscribeThreadData() {
    this.activatedRoute.params.subscribe((params) => {
      this.threadsDb.currentThreadId.set(params['threadId']);
      this.threadsDb.subMessageList(this.threadsDb.currentThreadId());
      this.threadsDb.subscribeToThread(this.threadsDb.currentThreadId());
    });
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (changes['threadId']) {
  //     this.scrollService.hasScrolled = false;
  //   }
  // }

  ngAfterViewInit() {
    this.scrollService.setScrollContainerThread(this.myScrollContainerThread);
  }

  closeThread() {
    this.threadsDb.closeThread();
  }

  scrollDown() {
    this.scrollService.scrollToBottom();
  }

  ngAfterViewChecked() {
    if (!this.scrollService.hasScrolled && this.messageComponents.length > 0) {
      this.scrollService.scrollToBottom();
      setTimeout(() => {
        this.scrollService.hasScrolled = true;
      }, 300);
    }
  }
}
