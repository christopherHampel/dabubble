import { Component, HostListener, inject, Input, SimpleChanges, ViewChild } from '@angular/core';
import { ChatsService } from './../../../services/message/chats.service';
import { CommonModule } from '@angular/common';
import { CurrentMessage } from '../../../interfaces/current-message';
import { FormsModule } from '@angular/forms';
import { TooltipComponent } from './tooltip/tooltip.component';
import { UsersDbService } from '../../../services/usersDb/users-db.service';
import { Timestamp } from 'firebase/firestore';
import { EmojisService } from '../../../services/message/emojis.service';
import { ThreadsDbService } from '../../../services/message/threads-db.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-single-message',
  imports: [CommonModule,
    FormsModule,
    TooltipComponent],
  templateUrl: './single-message.component.html',
  styleUrl: './single-message.component.scss'
})
export class SingleMessageComponent {

  @ViewChild(TooltipComponent) child:TooltipComponent | undefined;

  emojiService = inject(EmojisService);
  @Input() currentMessage!:any;
  @Input() editedText!: string;
  @Input() chatId!: string;
  @Input() component: 'chat' | 'thread' = 'chat';

  isEditing: boolean = false;
  emojiQuickBar:boolean = false;

  constructor(public chatService: ChatsService, 
              public usersService: UsersDbService,
              private threadService: ThreadsDbService) { }

  onIsEditingChange(newValue: boolean) {
    this.isEditing = newValue;
  }

  // ngOnChanges(changes: SimpleChanges): void {
  //   if (this.currentMessage && this.currentMessage && this.currentMessage.associatedThreadId) {
  //     this.messageCount$ = this.threadService.getMessagesCount(this.currentMessage.associatedThreadId);
  //   }
  // }

  updateMessage(currentMessage:CurrentMessage) {
    this.isEditing = false;
    const docId = currentMessage.docId;
    this.chatService.updateMessage(docId, this.currentMessage.text, this.chatId);
  }

  cancelEdit() {
    this.isEditing = false;
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
    this.emojiQuickBar = !this.emojiQuickBar;
    this.emojiService.emojiPickerOpen = !this.emojiService.emojiPickerOpen;
  }

  autoGrowTextZone(e:any) {
    e.target.style.height = "25px";
    e.target.style.height = (e.target.scrollHeight + 25)+"px";
  }

  addEmoji(emoji:string) {
    this.emojiService.currentMessage = this.currentMessage;
    this.emojiService.addEmoji(emoji, this.chatId);
    this.emojiQuickBar = !this.emojiQuickBar;
  }

  getUser() {
    if(this.isMessageFromCurrentUser()) {
      return 'own-message'
    } else {
      return 'other-message'
    }
  }

  isMessageFromCurrentUser() {
    return this.currentMessage.messageAuthor.id == this.usersService.currentUserSig()?.id;
  }

  showDate() {
    const rawTimestamp = this.currentMessage.createdAt;
  
    if (rawTimestamp && typeof rawTimestamp.toMillis === "function") {
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
  
    const inputDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayStart = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
  
    if (inputDate.getTime() === today.getTime()) {
      return "Heute";
    } else if (inputDate.getTime() === yesterdayStart.getTime()) {
      return "Gestern";
    }

    const day = String(inputDate.getDate()).padStart(2, '0');
    const month = String(inputDate.getMonth() + 1).padStart(2, '0');
    const year = inputDate.getFullYear();
    return `${day}.${month}.${year}`;
  }

  toggleEmojiQuickBar() {
    // this.emojiService.loadFrequentlyUsedEmojis();
    this.emojiQuickBar = !this.emojiQuickBar;
  }

  @HostListener('document:click', ['$event'])
  clickOutside() {
    if (this.emojiQuickBar) {
      this.emojiQuickBar = false;
    }
  }

  toggleBoolean() {
    this.chatService.menu = false;
    this.emojiQuickBar = false;
  }

  openThreadFromSingleMessage() {
    this.child?.openThread();
  }
}