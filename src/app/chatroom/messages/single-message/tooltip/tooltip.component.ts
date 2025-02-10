import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { EmojiPickerComponentComponent } from '../../../../shared/textarea/emoji-picker-component/emoji-picker-component.component';
import { CommonModule } from '@angular/common';
import { ThreadsDbService } from '../../../../services/message/threads-db.service';
import { ChatsService } from '../../../../services/message/chats.service';
import { ChatData } from '../../../../interfaces/chat-data';
import { Router } from '@angular/router';
import { CurrentMessage } from '../../../../interfaces/current-message';


@Component({
  selector: 'app-tooltip',
  imports: [MatMenuModule, MatIconModule, EmojiPickerComponentComponent, CommonModule],
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.scss'
})
export class TooltipComponent {

  testEmoji: any = { char: '😀', name: 'Grinning Face', category: 'Smileys' };
  // currentMessage: any;
  emojiMartOpen: boolean = false;
  private chat = inject(ChatsService);
  private threadsDb = inject(ThreadsDbService);
  @Input() isEditing: boolean = false;
  @Input() message: any;
  @Input() chatId:string = '';
  @Output() isEditingChange = new EventEmitter<boolean>();

  constructor(private router: Router, public chatService: ChatsService) { }

  editMessage() {
    this.isEditing = true;
    // this.menu = false;
    this.chatService.menu = false;
    this.isEditingChange.emit(this.isEditing);
  }

  addEmojiToMessage(placeholder: string, placeholder2: string) { }

  toggleEmoji() {
    this.emojiMartOpen = !this.emojiMartOpen;
  }

  toggleMenu() {
    this.chatService.menu = !this.chatService.menu;
  }

  async openThread() {
      // console.log(this.message);
    if (this.message.associatedThreadId) {
      this.threadsDb.currentThreadId.set(this.message.associatedThreadId.threadId);
      this.threadsDb.subMessageList(this.threadsDb.currentThreadId());
    } else {
      let thread: ChatData = {
        chatId: '',
        participants: this.chat.chatData.participants,
        participantsDetails: this.chat.chatData.participantsDetails
      }
      await this.threadsDb.addThread(thread, this.message, this.chatId, this.message);
      await this.chat.updateAssociatedThreadId(this.message.docId, this.chatId, this.threadsDb.currentThreadId());
    }
    this.router.navigate(['/chatroom', { outlets: { thread: ['thread', this.threadsDb.currentThreadId()] } }]);
  }
}