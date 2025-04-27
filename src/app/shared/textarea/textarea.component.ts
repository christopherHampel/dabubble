import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatsService } from '../../services/message/chats.service';
import { EmojiPickerComponentComponent } from './emoji-picker-component/emoji-picker-component.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ThreadsDbService } from '../../services/message/threads-db.service';
import { UsersDbService } from '../../services/usersDb/users-db.service';
import { UserViewSmallComponent } from '../user-view-small/user-view-small.component';
import { MessageAccesories } from '../../interfaces/message-accesories';
import { ChannelsDbService } from '../../services/message/channels-db.service';

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
  channelList: boolean = false;

  emojiMartOpen: boolean = false;

  constructor(
    public chatService: ChatsService,
    private route: ActivatedRoute,
    private userService: UsersDbService,
    private channelsDb: ChannelsDbService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.chatId = params.get('id')!;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['chatPartnerName'] || changes['message']) {
      this.autoFocusTextarea();
    }
  }

  checkTextLength(e: any) {
    e.preventDefault();

    if (this.message.length > 0) {
      this.sendText();
      this.message = '';
    }
  }

  autoFocusTextarea() {
    setTimeout( () => {
      this.textArea.nativeElement.focus();
    }, 25)
  }

  async sendText() {    
    const messageAccesories = this.getMessagemessageAccesories();
    this.emojiMartOpen = false;
    this.autoFocusTextarea();
    
    if (this.component == 'threads') {
      this.sendNewThread();
    } else {
      await this.chatService.addMessageToChat(
        messageAccesories as MessageAccesories
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
    else if(this.channelList) {
      this.channelList = false; 
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
    } else if(event.key === '#') {
      event.preventDefault();
      this.channelList = true;
    } else if(event.key === 'Escape') {
      this.userList = false;
      this.channelList = false;
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

  getChannelList() {
    return this.channelsDb.channelList;
  }

  tagChannel(channelName: string) {
    this.message += '#' + channelName;
    this.channelList = false; 
  }
}