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
import { EmojiPickerComponentComponent } from "../../shared/textarea/emoji-picker-component/emoji-picker-component.component";
import { EmojisService } from '../../services/message/emojis.service';

@Component({
  selector: 'app-threads',
  imports: [
    CommonModule,
    TextareaComponent,
    SingleMessageComponent,
    MessagesFieldComponent,
    EmojiPickerComponentComponent
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
    public emojiService: EmojisService,
    private chatService: ChatsService
  ) {
    effect(() => {
      let currentDocId = this.lastMessageDocId();
      console.log(currentDocId)
      if (currentDocId) {
        this.scrollService.scrollToBottom();
      } 
      if(this.threadsDb.currentThreadId()) {
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

  addEmoji(event:string) {
    this.emojiService.addEmoji(event, this.chatId, 'messages');
  }

  ngAfterViewInit() {
    this.scrollService.setScrollContainerThread(this.myScrollContainerThread);

    if(this.threadsDb.currentThreadId()) {
      
    }
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
