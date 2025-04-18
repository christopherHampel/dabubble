import {
  Component,
  effect,
  ElementRef,
  HostListener,
  inject,
  QueryList,
  signal,
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
import { ChatsService } from '../../services/message/chats.service';
import { EmojiPickerComponentComponent } from '../../shared/textarea/emoji-picker-component/emoji-picker-component.component';
import { EmojisService } from '../../services/message/emojis.service';
import { ResizeService } from '../../services/responsive/resize.service';

@Component({
  selector: 'app-threads',
  imports: [
    CommonModule,
    TextareaComponent,
    SingleMessageComponent,
    EmojiPickerComponentComponent,
  ],
  templateUrl: './threads.component.html',
  styleUrl: './threads.component.scss',
  providers: [ScrollService],
})
export class ThreadsComponent {
  threadsDb = inject(ThreadsDbService);
  threadClose: boolean = false;

  @ViewChild('myScrollContainerThread')
  private myScrollContainerThread!: ElementRef;
  @ViewChildren(SingleMessageComponent)
  messageComponents!: QueryList<SingleMessageComponent>;
  lastMessageDocId: WritableSignal<string | null> = signal<string | null>(null);

  constructor(
    private activatedRoute: ActivatedRoute,
    private scrollService: ScrollService,
    public emojiService: EmojisService,
    public chatService: ChatsService,
    private resize: ResizeService
  ) {
    effect(() => {
      let currentDocId = this.lastMessageDocId();
      if (currentDocId) {
        this.scrollService.scrollToBottom();
      }
      if (this.threadsDb.currentThreadId()) {
        this.chatService.watchLastMessageDocId(
          this.threadsDb.currentThreadId(),
          'threads',
          this.lastMessageDocId
        );
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

  addEmoji(event: string) {
    this.emojiService.addEmoji(
      event,
      this.threadsDb.currentThreadId(),
      'threads'
    );
  }

  ngAfterViewInit() {
    this.setScrollContainer();
  }

  setScrollContainer() {
    this.scrollService.setScrollContainerThread(this.myScrollContainerThread);
  }

  closeThread() {
    this.resize.setThisThreads(false);
    this.threadClose = true;
    setTimeout(() => {
      this.resize.setDevSpaceClose(false);
      this.threadsDb.closeThread();
    }, 500);
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

  @HostListener('document:click', ['$event'])
  clickOutside() {
    if (this.emojiService.emojiPickerOpenThreads) {
      this.emojiService.emojiPickerOpenThreads = false;
    }
  }

  getThreadAnswers() {
    let threadAnswers = this.chatService.firstThreadMessage()?.associatedThreadId.count;

    if(threadAnswers == 0) {
      return ''
    } else if(threadAnswers == 1) {
      return threadAnswers + ' Antwort'
    } else {
      return threadAnswers + ' Antworten'
    }
  }
}
