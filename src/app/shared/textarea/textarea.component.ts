import { Component, EventEmitter, HostListener, inject, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatsService } from '../../services/message/chats.service';
import { EmojiPickerComponentComponent } from './emoji-picker-component/emoji-picker-component.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ThreadsDbService } from '../../services/message/threads-db.service';
import { UsersDbService } from '../../services/usersDb/users-db.service';
import { UserProfile } from '../../interfaces/userProfile';
import { ScrollService } from '../../services/message/scroll.service';

@Component({
  selector: 'app-textarea',
  imports: [FormsModule, EmojiPickerComponentComponent, CommonModule],
  templateUrl: './textarea.component.html',
  styleUrl: './textarea.component.scss'
})
export class TextareaComponent implements OnInit {
  private threadDb = inject(ThreadsDbService);

  @Output() childEvent = new EventEmitter();

  @Input() message: string = '';
  @Input() chatPartnerName!: string;
  @Input() component: 'chat' | 'thread' = 'chat';
  @Input() id: string = '';

  chatId: string = '';
  users: string[] = [];
  userList: boolean = false;

  emojiMartOpen: boolean = false;

  constructor(
    public chatService: ChatsService, 
    private route: ActivatedRoute,
    private userService: UsersDbService,
    private scrollService: ScrollService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.chatId = params.get('id')!;
    })
  }

  // scrollDown() {
  //   this.childEvent.emit();
  // } 

  async sendText(e: any) {
    e.preventDefault();
    if (this.message.length > 0) {
      if (this.component == 'chat') {
        await this.chatService.addMessageToChat(this.message, this.chatId);
      } else if (this.component == 'thread') {
        await this.threadDb.addMessageToThread(this.threadDb.currentThreadId(), this.message);
      }
      this.message = '';
      this.scrollService.scrollToBottom();
    }
  }

  autoGrowTextZone(e: any) {
    if(e.key !== "Enter") {
      e.target.style.height = "25px";
      e.target.style.height = (e.target.scrollHeight + 25) + "px";
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

  addUserToMessage(user:string) {
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

    showAllUser() {
      this.toggleUserList();
      if(this.userList) {
        this.users = [];
        const users = this.users;
        this.userService.userListSig().forEach(user => {
          users.push(user.userName)
        });
      }
    }

    detectAtSymbol(event: KeyboardEvent) {
      if (event.key === '@') {
        event.preventDefault();
        this.showAllUser();
      }
    }
}
