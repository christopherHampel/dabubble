import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatsService } from '../../services/message/chats.service';
import { EmojiPickerComponentComponent } from './emoji-picker-component/emoji-picker-component.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ThreadsDbService } from '../../services/message/threads-db.service';
import { UsersDbService } from '../../services/usersDb/users-db.service';
import { ScrollService } from '../../services/message/scroll.service';
import { UserViewSmallComponent } from '../user-view-small/user-view-small.component';

@Component({
  selector: 'app-textarea',
  imports: [
    FormsModule,
    EmojiPickerComponentComponent,
    CommonModule,
    UserViewSmallComponent,
  ],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.scss',
})
export class TextareaComponent implements OnInit {
  private threadDb = inject(ThreadsDbService);

  @Output() childEvent = new EventEmitter();
  @ViewChild('textAreaRef') textArea!: ElementRef<HTMLTextAreaElement>;

  @Input() message: string = '';
  @Input() chatPartnerName: string = '';
  @Input() component: string = '';
  @Input() condition: boolean = false;

  chatId: string = '';
  userList: boolean = false;
  selectedUserId: string = '';

  emojiMartOpen: boolean = false;

  constructor(
    public chatService: ChatsService,
    private route: ActivatedRoute,
    private userService: UsersDbService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.chatId = params.get('id')!;
    });
  }

  checkTextLength(e: any) {
    e.preventDefault();

    if (this.message.length > 0) {
      this.sendText();
      this.message = '';
    }
  }

  async sendText() {    
    const messageAccesories = this.getMessagemessageAccesories();
    console.log(messageAccesories);
    
    if (this.component == 'threads') {
      this.sendNewThread();
    } else {
      await this.chatService.addMessageToChat(
        messageAccesories
      );
    }
  }

  async sendNewThread() {
    const firstThreadMessage = false;
    const startThreadMessage = this.chatService.firstThreadMessage();
    await this.threadDb.addMessageToThread(
      this.threadDb.currentThreadId(),
      this.message,
      firstThreadMessage,
      startThreadMessage
    );
    await this.chatService.updateThreadAnswersCount(
      this.threadDb.currentThreadId(),
    );
  }

  getMessagemessageAccesories() {
    const mentionedUsers = this.extractMentionedUsers(this.message);

    return {
      message: this.message,
      chatId: this.chatId,
      component: this.component,
      chatPartner: {
        chatPartner: this.chatPartnerName,
        currentUser: this.userService.currentUserSig()?.userName,
      },
      mentionedUsers
    }
  }

  autoGrowTextZone(e: any) {
    if (e.key !== 'Enter') {
      e.target.style.height = '25px';
      e.target.style.height = e.target.scrollHeight + 25 + 'px';
    }
  }

  toggleEmoji() {
    if(!this.condition) {
      this.userList = false;
      this.emojiMartOpen = !this.emojiMartOpen;
    }
  }

  addEmojiToMessage(emoji: string) {
    if (!this.textArea || !this.textArea.nativeElement) return;

    const textarea = this.textArea.nativeElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    this.message = this.message.substring(0, start) + emoji + this.message.substring(end);

    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
      textarea.focus();
    }, 0);
  }

  @HostListener('document:click', ['$event'])
  clickOutside() {
    if (this.emojiMartOpen) {
      this.emojiMartOpen = false;
    }
     else if(this.userList) {
      this.userList = false; 
    }
  }

  toggleUserList() {
    if(!this.condition) {
      this.emojiMartOpen = false;
      this.userList = !this.userList;
    }
  }

  detectAtSymbol(event: KeyboardEvent) {
    if (event.key === '@') {
      event.preventDefault();
      this.userList = true;
    }
  }

  getUserList() {
    if (this.userService.currentUser) {
      return this.userService.userList.filter((user) =>
        this.userService.currentUser!.directmessagesWith.includes(user.id)
      );
    } else {
      return [];
    }
  }

  tagUser(user: any) {
    this.message += '@' + user.userName;
    this.toggleUserList();
    this.focusTextarea();
  }

  focusTextarea() {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.focus();
    }
  }

  extractMentionedUsers(text: string): string[] {
    const mentionPattern = /@([\wäöüÄÖÜß-]+\s[\wäöüÄÖÜß-]+)/g;
    let matches = text.match(mentionPattern);

    if (!matches) return [];

    return matches.map((mention) => mention.substring(1));
  }

  getPlaceholder() {
    if (this.component == 'threads') {
      return 'Antworten...';
    } else {
      return 'Nachricht an ' + this.chatPartnerName;
    }
  }

  closeUserList() {
    this.userList = false;
  }
}
