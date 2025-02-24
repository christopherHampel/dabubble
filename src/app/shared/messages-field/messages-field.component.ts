import { CommonModule } from '@angular/common';
import {
  Component,
  effect,
  ElementRef,
  Input,
  QueryList,
  signal,
  SimpleChanges,
  ViewChild,
  ViewChildren,
  WritableSignal,
} from '@angular/core';
import { ChatsService } from '../../services/message/chats.service';
import { SingleMessageComponent } from '../../chatroom/messages/single-message/single-message.component';
import { ThreadsDbService } from '../../services/message/threads-db.service';
import { ScrollService } from '../../services/message/scroll.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-messages-field',
  imports: [CommonModule, SingleMessageComponent],
  templateUrl: './messages-field.component.html',
  styleUrl: './messages-field.component.scss',
  providers: [ScrollService],
})
export class MessagesFieldComponent {
  @ViewChild('myScrollContainer') private myScrollContainer!: ElementRef;

  @ViewChildren(SingleMessageComponent)
  messageComponents!: QueryList<SingleMessageComponent>;
  private logoutSubscription!: Subscription;

  @Input() chatId: string = '';
  @Input() component: string = '';
  lastMessageDocId: WritableSignal<string | null> = signal<string | null>(null);

  constructor(
    public chatService: ChatsService,
    public threadsDb: ThreadsDbService,
    private scrollService: ScrollService,
    private authService: AuthService
  ) {
    effect(() => {
      const currentDocId = this.lastMessageDocId();
      if (currentDocId) {
        this.scrollService.scrollToBottom();
      }
    });
  }

  ngOnInit(): void {
    this.subcribeLogOut();
    this.chatService.watchLastMessageDocId(this.chatId, this.component, this.lastMessageDocId);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chatId']) {
      this.scrollService.hasScrolled = false;
    }
  }

  ngAfterViewInit() {
    this.scrollService.setScrollContainer(this.myScrollContainer);
  }

  ngAfterViewChecked() {
    if (!this.scrollService.hasScrolled && this.messageComponents.length > 0) {
      setTimeout(() => {
        this.scrollService.scrollToBottom();
        this.scrollService.hasScrolled = true;
      }, 50);
    }
  }

  ngOnDestroy(): void {
    if (this.logoutSubscription) {
      this.logoutSubscription.unsubscribe();
    }
  }

  subcribeLogOut() {
    this.logoutSubscription = this.authService.logout$.subscribe(() => {
      this.scrollService.hasScrolled = false;
    });
  }

  trackByFn(index: number, item: any): number | string {
    return item.id;
  }

  threadComponent() {
    return this.component == 'threads';
  }
}
