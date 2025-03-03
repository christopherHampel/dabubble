import {
  Component,
  ElementRef,
  HostListener,
  inject,
  Input,
  ViewChild,
} from '@angular/core';
import { ChatsService } from './../../../services/message/chats.service';
import { CommonModule } from '@angular/common';
import { CurrentMessage } from '../../../interfaces/current-message';
import { FormsModule } from '@angular/forms';
import { TooltipComponent } from './tooltip/tooltip.component';
import { UsersDbService } from '../../../services/usersDb/users-db.service';
import { Timestamp } from 'firebase/firestore';
import { EmojisService } from '../../../services/message/emojis.service';
import { ThreadsDbService } from '../../../services/message/threads-db.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { EmojiPickerComponentComponent } from "../../../shared/textarea/emoji-picker-component/emoji-picker-component.component";

@Component({
  selector: 'app-single-message',
  imports: [CommonModule, FormsModule, TooltipComponent, EmojiPickerComponentComponent],
  templateUrl: './single-message.component.html',
  styleUrl: './single-message.component.scss',
})
export class SingleMessageComponent {
  @ViewChild(TooltipComponent) child: TooltipComponent | undefined;
  @ViewChild('textArea') textArea!: ElementRef;

  emojiService = inject(EmojisService);
  @Input() currentMessage!: any;
  @Input() editedText!: any;
  @Input() chatId!: string;
  @Input() component: string = '';

  isEditing: boolean = false;
  emojiQuickBar: boolean = false;
  currentDate: any = '';
  emojiPickerEdit:boolean = false;

  constructor(
    public chatService: ChatsService,
    public usersService: UsersDbService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    // this.currentDate = this.showDate();
  }

  ngAfterViewChecked() {
    if (this.isEditing) {
      setTimeout(() => this.adjustTextAreaHeight(), 0);
    }
  }

  adjustTextAreaHeight() {
    if (this.textArea) {
      const textarea = this.textArea.nativeElement;
      textarea.style.height = '25px';
      textarea.style.height = textarea.scrollHeight + 25 + 'px';
    }
  }

  onIsEditingChange(newValue: boolean) {
    this.isEditing = newValue;
  }

  updateMessage(currentMessage: CurrentMessage) {
    this.emojiPickerEdit = false;
    this.isEditing = false;
    const docId = currentMessage.docId;
    this.chatService.updateMessage(
      docId,
      this.currentMessage.text,
      this.chatId,
      this.component
    );
  }

  cancelEdit() {
    this.isEditing = false;
    this.emojiPickerEdit = false;
  }

  getTime(): string | null {
    if (!this.currentMessage?.createdAt) return null;
    const messageTime = this.currentMessage.createdAt.toDate();
    return messageTime.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  toggleEmoji(currentMessage: CurrentMessage) {
    this.emojiService.currentMessage = currentMessage;

    if (this.component != 'threads') {
      this.emojiService.emojiPickerOpen = !this.emojiService.emojiPickerOpen;
    } else {
      this.emojiService.emojiPickerOpenThreads =
        !this.emojiService.emojiPickerOpenThreads;
    }
  }

  autoGrowTextZone(e: any) {
    e.target.style.height = '25px';
    e.target.style.height = e.target.scrollHeight + 25 + 'px';
  }

  addEmoji(emoji: string) {
    this.emojiService.currentMessage = this.currentMessage;
    // if (this.component == 'threads') {
    //   this.chatService.component.set(this.component);
    //   this.emojiService.addEmoji(
    //     emoji,
    //     this.currentMessage.associatedThreadId,
    //     this.component
    //   );
    //   this.chatService.component.set('chat');
    // } else {
      // this.emojiService.addEmoji(emoji, this.chatId, this.component);
      this.emojiService.addEmoji(emoji, this.currentMessage.chatId, this.currentMessage.component);
    // }
    this.emojiQuickBar = !this.emojiQuickBar;
  }

  addEmojiToEdit(emoji: string) {
    if (!this.textArea || !this.textArea.nativeElement) return;

    const textarea = this.textArea.nativeElement;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;

    this.currentMessage.text = this.currentMessage.text.substring(0, start) + emoji + this.currentMessage.text.substring(end);

    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + emoji.length;
      textarea.focus();
    }, 0);
  }

  getUser() {
    if (this.isMessageFromCurrentUser()) {
      return 'own-message';
    } else {
      return 'other-message';
    }
  }

  getTooltipPosition() {
    if (this.isMessageFromCurrentUser()) {
      return 'tooltip-position-left';
    } else {
      return 'tooltip-position-right';
    }
  }

  isMessageFromCurrentUser() {
    return (
      this.currentMessage.messageAuthor.id ==
      this.usersService.currentUserSig()?.id
    );
  }

  showDate() {
    const rawTimestamp = this.currentMessage.createdAt;

    if (rawTimestamp && typeof rawTimestamp.toMillis === 'function') {
      const timestampInMs = rawTimestamp.toMillis();
      const date = new Date(timestampInMs);
      const messageDate = this.checkTodayYesterday(date);
      return messageDate;
    } else {
      return 'No Current Date available.';
    }
  }

  checkTodayYesterday(timestamp: Date | Timestamp): string {
    const date = timestamp instanceof Date ? timestamp : timestamp.toDate();

    const now = new Date();
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    const inputDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(
      yesterday.getFullYear(),
      yesterday.getMonth(),
      yesterday.getDate()
    );

    if (inputDate.getTime() === today.getTime()) {
      return 'Heute';
    } else if (inputDate.getTime() === yesterdayStart.getTime()) {
      return 'Gestern';
    }

    const day = String(inputDate.getDate()).padStart(2, '0');
    const month = String(inputDate.getMonth() + 1).padStart(2, '0');
    const year = inputDate.getFullYear();
    return `${day}.${month}.${year}`;
  }

  getLastThreadTime() {
    if (this.currentMessage.associatedThreadId.lastMessage == '') {
      return '';
    } else {
      const timestamp = this.currentMessage.associatedThreadId.lastMessage;
      const date = new Date(
        timestamp.seconds * 1000 + timestamp.nanoseconds / 1e6
      );
      const time = this.checkTodayYesterday(date);
      const formattedTime = date.toLocaleTimeString('de-DE', {
        hour: '2-digit',
        minute: '2-digit',
      });
      return this.returnTimeValue(time, formattedTime);
    }
  }

  returnTimeValue(time: string, formattedTime: string) {
    if (time == 'Heute') {
      return 'Letzte Nachricht ' + formattedTime + ' Uhr';
    } else if (time == 'Gestern') {
      return 'Letzte Nachricht ' + time;
    } else {
      return 'Letzte Nachricht am ' + time;
    }
  }

  toggleEmojiQuickBar() {
    this.emojiQuickBar = !this.emojiQuickBar;
  }

  @HostListener('document:click', ['$event'])
  clickOutside() {
    if (this.emojiQuickBar || this.isEditing) {
      this.emojiQuickBar = false;
      this.isEditing = false;
    }

    if(this.emojiPickerEdit) {
      this.emojiPickerEdit = false
    }
  }

  toggleMenuAndQuickbar() {
    this.chatService.menu = false;
    this.emojiQuickBar = false;
  }

  openThreadFromSingleMessage() {
    this.child?.openThread();
  }

  getThreadCountReplies() {
    let numberOfThreads = this.currentMessage.associatedThreadId.count;

    if (numberOfThreads == 0 || this.currentMessage.associatedThreadId == '') {
      return '';
    } else if (numberOfThreads == 1) {
      return '1 Antwort';
    } else {
      return `${numberOfThreads} Antworten`;
    }
  }

  openThread() {
    this.child?.openThread();
  }

  getEmojiNames(emoji: any) {
    const emojiNames = emoji.name;
    return emojiNames;
  }

  formatMessage(text: string, mentionedUsers: string[]): SafeHtml {
    if (!mentionedUsers || mentionedUsers.length === 0) {
      return text;
    }

    mentionedUsers.forEach((user) => {
      const mentionRegex = new RegExp(`@${user.replace(/ /g, '\\s')}`, 'g');
      text = text.replace(
        mentionRegex,
        `<span class="mention">@${user}</span>`
      );
    });

    return this.sanitizer.bypassSecurityTrustHtml(text);
  }

  // addClickEventToMentions() {
  //   setTimeout(() => { // Timeout, damit Angular das DOM fertig rendert
  //     const mentions = this.elRef.nativeElement.querySelectorAll('.mention');
  //     mentions.forEach((mention: HTMLElement) => {
  //       this.renderer.listen(mention, 'click', () => {
  //         this.openUserProfile(mention.innerText.replace('@', '')); // Entfernt das '@'
  //       });
  //     });
  //   }, 0);
  // }

  addEmojiEditMessage() {
    this.emojiPickerEdit = !this.emojiPickerEdit;
  }
}
