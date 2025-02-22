import {
  Component,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatsService } from '../../services/message/chats.service';
import { EmojiPickerComponentComponent } from './emoji-picker-component/emoji-picker-component.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ThreadsDbService } from '../../services/message/threads-db.service';
import { UsersDbService } from '../../services/usersDb/users-db.service';
// import { UserProfile } from '../../interfaces/userProfile';
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

  @Input() message: string = '';
  @Input() chatPartnerName!: string;
  // @Input() component: 'chat' | 'thread' | 'channels' = 'chat';
  @Input() component:string = '';
  @Input() id: string = '';

  chatId: string = '';
  // users: string[] = [];
  userList: boolean = false;
  selectedUserId: string = '';

  emojiMartOpen: boolean = false;

  constructor(
    public chatService: ChatsService,
    private route: ActivatedRoute,
    private userService: UsersDbService,
    private scrollService: ScrollService,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.chatId = params.get('id')!;
      console.log('Id From Textarea is:', this.chatId)
    });
  }

  async sendText(e: any) {
    e.preventDefault();
    
    if (this.message.length > 0) {
      
      if (this.component == 'thread') {
        this.sendNewThread()
      } else {
        await this.chatService.addMessageToChat(this.message, this.chatId, this.component);
      }
      this.message = '';
    }
  }

  async sendNewThread() {
    const firstThreadMessage = false;

    await this.threadDb.addMessageToThread(
      this.threadDb.currentThreadId(),
      this.message,
      firstThreadMessage
    );
    await this.chatService.updateThreadAnswersCount(
      this.threadDb.currentThreadId(),
      this.component
    );
  }

  autoGrowTextZone(e: any) {
    if (e.key !== 'Enter') {
      e.target.style.height = '25px';
      e.target.style.height = e.target.scrollHeight + 25 + 'px';
    }
  }

  toggleEmoji() {
    this.emojiMartOpen = !this.emojiMartOpen;
  }

  preventClose(event: MouseEvent): void {
    event.stopPropagation();
  }

  addEmojiToMessage(emoji: string) {
    this.message += emoji;
  }

  addUserToMessage(user: string) {
    this.message += '@' + user;
    this.userList = false;
  }

  @HostListener('document:click', ['$event'])
  clickOutside() {
    if (this.emojiMartOpen || this.userList) {
      this.emojiMartOpen = false;
      this.userList = false;
    }
  }

  toggleUserList() {
    this.userList = !this.userList;
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

  tagUser(user:any) {    
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
}